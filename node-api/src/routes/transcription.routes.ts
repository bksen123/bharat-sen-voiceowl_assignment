import { Router } from "express";
import * as controller from "../controllers/transcription.controller";

const router = Router();

router.post("/", controller.createTranscription);
router.get("/", controller.listRecentTranscriptions);
router.delete("/", controller.deleteTranscriptionById);
router.post("/azure", controller.createAzureTranscription);

export default router;
