import { Request, Response } from "express";
import * as service from "../services/transcription.service";
import { Transcription } from "../models/transcription.model";

export const createTranscription = async (req: Request, res: Response) => {
  console.log("req.body===========", req.body);
  try {
    const { audioUrl } = req.body as { audioUrl: string };
    if (!audioUrl) return res.status(400).json({ error: "audioUrl required" });

    const record = await service.transcribeAndSave(audioUrl);
    return res.status(201).json({
      status: 200,
      message: "Transcription has been saved successfully.",
      data: record,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "internal error" });
  }
};

// export const listRecentTranscriptions = async (req: Request, res: Response) => {
//   try {
//     const items = await service.listLast30Days();
//     return res.json(items);
//   } catch (err: any) {
//     console.error(err);
//     return res.status(500).json({ error: err.message || "internal error" });
//   }
// };

export const listRecentTranscriptions = async (req: Request, res: Response) => {
  console.log("req.query====================", req.query);
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await service.listTranscriptionsPaginated(page, limit);
    return res.json({
      status: 200,
      message: "Getting transcription successfully.",
      data: result
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "internal error" });
  }
};

export const createAzureTranscription = async (req: Request, res: Response) => {
  try {
    const { audioUrl, language } = req.body as {
      audioUrl: string;
      language?: string;
    };
    if (!audioUrl) return res.status(400).json({ error: "audioUrl required" });

    const record = await service.transcribeWithAzure(audioUrl, language);
    return res.status(201).json({ id: record._id });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "internal error" });
  }
};
export const deleteTranscriptionById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.query as {
      _id: string;
    };
    if (!_id) return res.status(400).json({ error: "_id required" });
    const deletedRecord = await service.deleteTranscriptionById(_id);
    return res.status(201).json({
      status: 200,
      message: "transcription deleted successfully!",
      data: deletedRecord
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "internal error" });
  }
};
