import { retry } from './retry';

export async function downloadAudioMock(url: string): Promise<Buffer> {
  return retry(async () => {
    if (!url.startsWith('http')) {
      const err: any = new Error('invalid url');
      err.code = 'INVALID_URL';
      throw err;
    }
    if (url.includes('fail-once')) {
      if (!(globalThis as any).__fail_once_flag) {
        (globalThis as any).__fail_once_flag = true;
        throw new Error('simulated network error');
      }
    }
    await new Promise((r) => setTimeout(r, 150));
    return Buffer.from('dummy-audio-bytes');
  }, 3, 200);
}