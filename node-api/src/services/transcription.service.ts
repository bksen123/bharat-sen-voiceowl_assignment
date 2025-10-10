import { Transcription, ITranscription } from "../models/transcription.model";
import { downloadAudioMock } from "../utils/downloader";
import { transcribeWithAzureMock } from "../integrations/azure";

export async function transcribeAndSave(
  audioUrl: string
): Promise<ITranscription> {
  const buf = await downloadAudioMock(audioUrl);
  console.log("buf==========", buf);
  const text = `transcribed text (mock) - ${audioUrl}`;
  const record = await Transcription.create({
    audioUrl,
    transcription: text,
    source: "mock",
  });
  return record;
}

export async function listLast30Days() {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  return Transcription.find({ createdAt: { $gte: since } })
    .sort({ createdAt: -1 })
    .lean();
}

export async function transcribeWithAzure(audioUrl: string, language?: string) {
  const buf = await downloadAudioMock(audioUrl);
  const transcribed = await transcribeWithAzureMock(buf, language || "en-US");
  const record = await Transcription.create({
    audioUrl,
    transcription: transcribed,
    source: "azure",
  });
  return record;
}

export async function listTranscriptionsPaginated(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const items = await Transcription.find({ createdAt: { $gte: since } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Transcription.countDocuments({
    createdAt: { $gte: since },
  });
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items,
  };
}

export async function deleteTranscriptionById(_id: string) {
  const deleted = await Transcription.findByIdAndDelete(_id);
  console.log("deleted", deleted);
  if (!deleted) {
    throw new Error("Transcription not found");
  }
  return { message: "Transcription deleted successfully", deleted: deleted };
}
