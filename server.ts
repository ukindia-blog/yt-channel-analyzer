import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json());

  // Session configuration for iframe environment
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "youtube-tracker-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        sameSite: "none",
        httpOnly: true,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "505507899807-hd19mpo852t01hv2kutq9v5frrf0523n.apps.googleusercontent.com",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: "/auth/google/callback",
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Auth Routes
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    }
  );

  app.get("/api/auth/user", (req, res) => {
    res.json(req.user || null);
  });

  app.get("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  // YouTube API Failover Helper
  const getApiKeys = () => {
    return [
      process.env.YOUTUBE_API_KEY,
      process.env.YOUTUBE_API_KEY_2,
      process.env.YOUTUBE_API_KEY_3,
      process.env.YOUTUBE_API_KEY_4,
    ].filter(Boolean) as string[];
  };

  const fetchWithFailover = async (urlBuilder: (key: string) => string) => {
    const keys = getApiKeys();
    if (keys.length === 0) {
      throw new Error("No YouTube API keys configured.");
    }

    let lastError: any = null;
    for (const key of keys) {
      try {
        const response = await fetch(urlBuilder(key));
        const data = await response.json();
        
        if (data.error) {
          // If it's a quota error or invalid key, try next key
          if (data.error.errors?.[0]?.reason === "quotaExceeded" || data.error.code === 403) {
            console.warn(`YouTube API error (403/Quota) for key: ${key.substring(0, 5)}... Message: ${data.error.message}`);
            lastError = data.error;
            continue;
          }
          return { status: response.status, data };
        }
        return { status: response.status, data };
      } catch (err) {
        lastError = err;
        continue;
      }
    }
    throw lastError || new Error("All API keys failed.");
  };

  // YouTube API Proxy
  app.get("/api/youtube/channel", async (req, res) => {
    const { query } = req.query;

    try {
      let channelId = query as string;

      // Basic detection for @username or URL
      if (channelId.includes("youtube.com/")) {
        if (channelId.includes("/@")) {
          channelId = channelId.split("/@")[1].split("/")[0];
          if (!channelId.startsWith("@")) channelId = "@" + channelId;
        } else if (channelId.includes("/channel/")) {
          channelId = channelId.split("/channel/")[1].split("/")[0];
        } else if (channelId.includes("/c/")) {
          channelId = channelId.split("/c/")[1].split("/")[0];
        }
      }

      // If it's a handle (starts with @), search for the channel ID first
      if (channelId.startsWith("@")) {
        const { data: searchData, status } = await fetchWithFailover(
          (key) => `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelId)}&key=${key}`
        );
        
        if (searchData.error) {
          return res.status(status).json({ error: searchData.error.message || "YouTube API Error" });
        }

        if (searchData.items && searchData.items.length > 0) {
          channelId = searchData.items[0].snippet.channelId;
        } else {
          return res.status(404).json({ error: "Channel not found" });
        }
      }

      // Fetch channel details
      const { data: channelData, status } = await fetchWithFailover(
        (key) => `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails,topicDetails&id=${channelId}&key=${key}`
      );

      if (channelData.error) {
        return res.status(status).json({ error: channelData.error.message || "YouTube API Error" });
      }

      if (!channelData.items || channelData.items.length === 0) {
        // Try searching if ID didn't work
        const { data: searchData } = await fetchWithFailover(
          (key) => `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelId)}&key=${key}`
        );
        
        if (searchData.items && searchData.items.length > 0) {
          const newId = searchData.items[0].snippet.channelId;
          const { data: retryData } = await fetchWithFailover(
            (key) => `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails,topicDetails&id=${newId}&key=${key}`
          );
          if (retryData.items && retryData.items.length > 0) {
            return res.json(retryData.items[0]);
          }
        }
        return res.status(404).json({ error: "Channel not found" });
      }

      res.json(channelData.items[0]);
    } catch (error: any) {
      console.error("Error fetching channel:", error);
      res.status(500).json({ error: error.message || "Failed to fetch channel data" });
    }
  });

  app.get("/api/youtube/videos", async (req, res) => {
    const { channelId, order = "date" } = req.query;

    try {
      const { data: videosData, status } = await fetchWithFailover(
        (key) => `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=${order}&type=video&key=${key}`
      );

      if (videosData.error) {
        return res.status(status).json({ error: videosData.error.message || "YouTube API Error" });
      }

      if (!videosData.items || videosData.items.length === 0) {
        return res.json([]);
      }

      // Fetch detailed stats for these videos
      const videoIds = videosData.items.map((v: any) => v.id.videoId).join(",");
      const { data: statsData, status: statsStatus } = await fetchWithFailover(
        (key) => `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${key}`
      );

      if (statsData.error) {
        return res.status(statsStatus).json({ error: statsData.error.message || "YouTube API Error" });
      }

      res.json(statsData.items || []);
    } catch (error: any) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: error.message || "Failed to fetch videos" });
    }
  });

  // Admin/Settings route to check API status (protected)
  app.get("/api/admin/api-status", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const keys = getApiKeys();
    res.json({
      configuredKeys: keys.length,
      keysMasked: keys.map(k => `${k.substring(0, 4)}...${k.substring(k.length - 4)}`)
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
