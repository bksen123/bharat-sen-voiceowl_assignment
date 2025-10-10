import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import transcriptionRoutes from "./routes/transcription.routes";
// import { setupSwagger } from "./swagger";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const app = express();

// ✅ Enable CORS for Angular (port 4200)
app.use(
  cors({
    credentials: true, 
    origin: ["http://localhost:4200"]
  })
);
app.options("*", cors());
app.use(bodyParser.json());

// API routes
app.use("/api/v1/transcription", transcriptionRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => res.send({ ok: true, message: "VoiceOwl API" }));

export default app;
