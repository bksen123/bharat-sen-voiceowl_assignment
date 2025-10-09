export async function transcribeWithAzureMock(audioBuffer: Buffer, language = 'en-US') {
  await new Promise((r) => setTimeout(r, 300));
  return `azure-transcription: [${language}] transcribed text`;
}