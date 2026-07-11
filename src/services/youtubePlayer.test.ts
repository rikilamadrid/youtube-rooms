import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { __resetYoutubePlayerStateForTests, loadYoutubeIframeApi } from './youtubePlayer';

beforeEach(() => {
  __resetYoutubePlayerStateForTests();
  delete window.YT;
  delete window.onYouTubeIframeAPIReady;
  document.getElementById('youtube-iframe-api')?.remove();
});

afterEach(() => {
  __resetYoutubePlayerStateForTests();
  delete window.YT;
  delete window.onYouTubeIframeAPIReady;
  document.getElementById('youtube-iframe-api')?.remove();
});

describe('loadYoutubeIframeApi', () => {
  it('injects the IFrame API script exactly once', () => {
    void loadYoutubeIframeApi();
    void loadYoutubeIframeApi();

    const scripts = document.querySelectorAll('#youtube-iframe-api');
    expect(scripts).toHaveLength(1);
  });

  it('resolves with window.YT once the API signals it is ready', async () => {
    const promise = loadYoutubeIframeApi();
    const fakeYT = { Player: class {}, PlayerState: { ENDED: 0 } } as unknown as Window['YT'];
    window.YT = fakeYT;
    window.onYouTubeIframeAPIReady?.();

    await expect(promise).resolves.toBe(fakeYT);
  });

  it('resolves immediately if window.YT is already present', async () => {
    const fakeYT = { Player: class {}, PlayerState: { ENDED: 0 } } as unknown as Window['YT'];
    window.YT = fakeYT;

    await expect(loadYoutubeIframeApi()).resolves.toBe(fakeYT);
  });
});
