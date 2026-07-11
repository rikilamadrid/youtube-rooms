const IFRAME_API_SCRIPT_SRC = 'https://www.youtube.com/iframe_api';
const IFRAME_API_SCRIPT_ID = 'youtube-iframe-api';

export type YoutubePlayerStateValue = -1 | 0 | 1 | 2 | 3 | 5;

export interface YoutubePlayerStateChangeEvent {
  data: YoutubePlayerStateValue;
  target: YoutubePlayerInstance;
}

export interface YoutubePlayerReadyEvent {
  target: YoutubePlayerInstance;
}

export interface YoutubePlayerInstance {
  destroy: () => void;
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => YoutubePlayerStateValue;
}

interface YoutubePlayerOptions {
  videoId?: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (event: YoutubePlayerReadyEvent) => void;
    onStateChange?: (event: YoutubePlayerStateChangeEvent) => void;
  };
}

interface YoutubePlayerConstructor {
  new (element: HTMLElement, options: YoutubePlayerOptions): YoutubePlayerInstance;
}

interface YoutubeIframeApi {
  Player: YoutubePlayerConstructor;
  PlayerState: {
    ENDED: YoutubePlayerStateValue;
    PLAYING: YoutubePlayerStateValue;
    PAUSED: YoutubePlayerStateValue;
    BUFFERING: YoutubePlayerStateValue;
    CUED: YoutubePlayerStateValue;
    UNSTARTED: YoutubePlayerStateValue;
  };
}

declare global {
  interface Window {
    YT?: YoutubeIframeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<YoutubeIframeApi> | null = null;

/**
 * Loads the YouTube IFrame Player API script exactly once and resolves with
 * the resulting `window.YT` global, memoized like `loadGisScript` in
 * `youtubeAuth.ts` so repeated player mounts don't re-inject the script.
 */
export function loadYoutubeIframeApi(): Promise<YoutubeIframeApi> {
  if (window.YT) {
    return Promise.resolve(window.YT);
  }
  if (apiLoadPromise) {
    return apiLoadPromise;
  }

  apiLoadPromise = new Promise<YoutubeIframeApi>((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT!);
    };

    if (document.getElementById(IFRAME_API_SCRIPT_ID)) {
      return;
    }
    const script = document.createElement('script');
    script.id = IFRAME_API_SCRIPT_ID;
    script.src = IFRAME_API_SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

/** Test-only: resets the memoized API load promise between test cases. */
export function __resetYoutubePlayerStateForTests(): void {
  apiLoadPromise = null;
}
