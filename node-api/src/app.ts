import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import transcriptionRoutes from "./routes/transcription.routes";
// import { setupSwagger } from "./swagger";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const app = express();

// Path to Angular `dist` folder
const clientBuildPath = path.join(__dirname, '..', 'public');

// ✅ Enable CORS for Angular (port 4200)
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);
app.options("*", cors());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Angular static files
app.use(express.static(clientBuildPath));

// Fallback to `index.html` for Angular SPA routes
app.use((req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === "GET" &&
    !req.path.startsWith("/api") &&
    !req.path.startsWith("/assets") &&
    !req.path.includes(".") // skips JS/CSS/image file requests
  ) {
    res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
      if (err) {
        next(err);
      }
    });
  } else {
    next(); // Let API routes handle the request
  }
});

// API routes
app.use("/api/v1/transcription", transcriptionRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root endpoint
app.get("/", (req: Request, res: Response) =>
  res.send({ ok: true, message: "VoiceOwl API" })
);

export default app;
