export class newTranscription {
  _id?: string;
  audioUrl: string = '';
  transcription: string = '';
  source: 'mock' | 'Azure' = 'mock';
  is_active: number = 1;
}
