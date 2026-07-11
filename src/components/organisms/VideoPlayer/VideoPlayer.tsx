import { useEffect, useRef, useState } from 'react';
import { loadYoutubeIframeApi, type YoutubePlayerInstance } from '../../../services/youtubePlayer';
import './VideoPlayer.css';

export type VideoPlayerProps = {
  /** The YouTube video id to load and play. */
  youtubeVideoId: string;
  /** Called when the currently loaded video finishes playing. */
  onEnded: () => void;
  /** Called when the "Previous" control is activated. Omit to hide the control. */
  onPrevious?: () => void;
  /** Called when the "Next" control is activated. Omit to hide the control. */
  onNext?: () => void;
  /** Disables the "Previous" control (e.g. already at the first queued video). */
  hasPrevious?: boolean;
  /** Disables the "Next" control (e.g. already at the last queued video). */
  hasNext?: boolean;
};

const POLL_INTERVAL_MS = 250;
const SEEK_SETTLE_MS = 500;

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function PreviousIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 6h2v12H6zM20 6v12l-9-6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 6h2v12h-2zM4 6l9 6-9 6z" />
    </svg>
  );
}

function formatSeconds(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '0:00';
  }
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${paddedSeconds}`;
  }
  return `${minutes}:${paddedSeconds}`;
}

/**
 * Mounts a single YouTube IFrame Player instance and keeps it in sync with
 * `youtubeVideoId`: creates the player once on mount, then swaps videos via
 * `loadVideoById` on prop changes rather than remounting the iframe.
 * Isolated from `src/services/youtubePlayer.ts` (the script-loading/type
 * surface) so this component stays test-friendly without touching the real
 * YouTube API. YouTube's own chrome is disabled (`controls: 0`) in favor of
 * a custom play/pause/seek/next/previous overlay that reveals on hover or
 * keyboard focus, since the built-in controls have no notion of this app's
 * queue.
 */
export function VideoPlayer({
  youtubeVideoId,
  onEnded,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YoutubePlayerInstance | null>(null);
  const onEndedRef = useRef(onEnded);
  const isReadyRef = useRef(false);
  const isSeekingRef = useRef(false);
  const seekSettleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackedVideoId, setTrackedVideoId] = useState(youtubeVideoId);

  // Reset the displayed time when the video changes, following React's
  // recommended "adjust state during render" pattern rather than an effect,
  // since it's purely derived from the youtubeVideoId prop.
  if (youtubeVideoId !== trackedVideoId) {
    setTrackedVideoId(youtubeVideoId);
    setCurrentTime(0);
    setDuration(0);
  }

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    let cancelled = false;

    loadYoutubeIframeApi().then((YT) => {
      if (cancelled || !containerRef.current) {
        return;
      }
      playerRef.current = new YT.Player(containerRef.current, {
        videoId: youtubeVideoId,
        playerVars: { autoplay: 1, controls: 0 },
        events: {
          onReady: () => {
            isReadyRef.current = true;
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              onEndedRef.current();
            }
            setIsPlaying(event.data === YT.PlayerState.PLAYING);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      clearTimeout(seekSettleTimeoutRef.current);
      isReadyRef.current = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // Player creation only happens once on mount; the initial youtubeVideoId
    // is passed via playerVars above, and later changes are handled by the
    // effect below via loadVideoById rather than recreating the player.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    playerRef.current?.loadVideoById(youtubeVideoId);
  }, [youtubeVideoId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player || !isReadyRef.current || isSeekingRef.current) {
        return;
      }
      setCurrentTime(player.getCurrentTime());
      setDuration(player.getDuration());
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  function handleTogglePlay() {
    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  }

  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setCurrentTime(value);
    playerRef.current?.seekTo(value, true);

    isSeekingRef.current = true;
    clearTimeout(seekSettleTimeoutRef.current);
    seekSettleTimeoutRef.current = setTimeout(() => {
      isSeekingRef.current = false;
    }, SEEK_SETTLE_MS);
  }

  return (
    <div className="sr-video-player">
      <div className="sr-video-player__embed" data-testid="video-player" ref={containerRef} />
      <div className="sr-video-player__controls">
        <button
          type="button"
          className="sr-video-player__control"
          onClick={onPrevious}
          disabled={!onPrevious || !hasPrevious}
          aria-label="Play previous video"
        >
          <PreviousIcon />
        </button>
        <button
          type="button"
          className="sr-video-player__control sr-video-player__control--play"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          className="sr-video-player__control"
          onClick={onNext}
          disabled={!onNext || !hasNext}
          aria-label="Play next video"
        >
          <NextIcon />
        </button>
        <span className="sr-video-player__time">{formatSeconds(currentTime)}</span>
        <input
          type="range"
          className="sr-video-player__seek"
          min={0}
          max={duration || 0}
          step={1}
          value={Math.min(currentTime, duration || 0)}
          onChange={handleSeek}
          aria-label="Seek"
        />
        <span className="sr-video-player__time">{formatSeconds(duration)}</span>
      </div>
    </div>
  );
}
