import { Schema, model, Document } from 'mongoose';

export interface ITranscription extends Document {
  audioUrl: string;
  transcription: string;
  source?: string;
  createdAt: Date;
}

const TranscriptionSchema = new Schema<ITranscription>({
  audioUrl: { type: String, required: true },
  transcription: { type: String, required: true },
  source: { type: String, default: 'mock' },
  createdAt: { type: Date, default: () => new Date() }
});

TranscriptionSchema.index({ createdAt: -1 });

export const Transcription = model<ITranscription>('Transcription', TranscriptionSchema);