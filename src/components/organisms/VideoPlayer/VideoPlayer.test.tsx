import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loadYoutubeIframeApi } from '../../../services/youtubePlayer';
import type { YoutubePlayerStateChangeEvent } from '../../../services/youtubePlayer';
import { VideoPlayer } from './VideoPlayer';

vi.mock('../../../services/youtubePlayer', () => ({
  loadYoutubeIframeApi: vi.fn(),
}));

const mockedLoadYoutubeIframeApi = vi.mocked(loadYoutubeIframeApi);

function installFakeYT() {
  const destroy = vi.fn();
  const loadVideoById = vi.fn();
  const playVideo = vi.fn();
  const pauseVideo = vi.fn();
  const seekTo = vi.fn();
  const getCurrentTime = vi.fn(() => 0);
  const getDuration = vi.fn(() => 100);
  let onStateChange: ((event: YoutubePlayerStateChangeEvent) => void) | undefined;

  class FakePlayer {
    constructor(
      _element: HTMLElement,
      options: { events?: { onReady?: () => void; onStateChange?: typeof onStateChange } },
    ) {
      onStateChange = options.events?.onStateChange;
      options.events?.onReady?.();
    }
    destroy = destroy;
    loadVideoById = loadVideoById;
    playVideo = playVideo;
    pauseVideo = pauseVideo;
    seekTo = seekTo;
    getCurrentTime = getCurrentTime;
    getDuration = getDuration;
    getPlayerState = () => PlayerState.UNSTARTED;
  }

  const PlayerState = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5, UNSTARTED: -1 } as const;

  mockedLoadYoutubeIframeApi.mockResolvedValue({
    Player: FakePlayer as never,
    PlayerState,
  } as never);

  return {
    destroy,
    loadVideoById,
    playVideo,
    pauseVideo,
    seekTo,
    getCurrentTime,
    getDuration,
    fireEnded: () => onStateChange?.({ data: PlayerState.ENDED, target: {} as never }),
    firePlaying: () => onStateChange?.({ data: PlayerState.PLAYING, target: {} as never }),
    firePaused: () => onStateChange?.({ data: PlayerState.PAUSED, target: {} as never }),
  };
}

describe('VideoPlayer', () => {
  it('creates a player for the given video id', async () => {
    installFakeYT();
    render(<VideoPlayer youtubeVideoId="video-1" onEnded={vi.fn()} />);

    await waitFor(() => expect(mockedLoadYoutubeIframeApi).toHaveBeenCalled());
    expect(screen.getByTestId('video-player')).toBeInTheDocument();
  });

  it('calls onEnded when the player reports the ENDED state', async () => {
    const fakeYT = installFakeYT();
    const handleEnded = vi.fn();
    render(<VideoPlayer youtubeVideoId="video-1" onEnded={handleEnded} />);

    await waitFor(() => expect(mockedLoadYoutubeIframeApi).toHaveBeenCalled());
    fakeYT.fireEnded();

    expect(handleEnded).toHaveBeenCalled();
  });

  it('loads the new video via loadVideoById when youtubeVideoId changes', async () => {
    const fakeYT = installFakeYT();
    const { rerender } = render(<VideoPlayer youtubeVideoId="video-1" onEnded={vi.fn()} />);

    await waitFor(() => expect(mockedLoadYoutubeIframeApi).toHaveBeenCalled());
    rerender(<VideoPlayer youtubeVideoId="video-2" onEnded={vi.fn()} />);

    await waitFor(() => expect(fakeYT.loadVideoById).toHaveBeenCalledWith('video-2'));
  });

  it('destroys the player on unmount', async () => {
    const fakeYT = installFakeYT();
    const { unmount } = render(<VideoPlayer youtubeVideoId="video-1" onEnded={vi.fn()} />);

    await waitFor(() => expect(mockedLoadYoutubeIframeApi).toHaveBeenCalled());
    unmount();

    expect(fakeYT.destroy).toHaveBeenCalled();
  });

  it('toggles play/pause via the play control and reflects state changes', async () => {
    const user = userEvent.setup();
    const fakeYT = installFakeYT();
    render(<VideoPlayer youtubeVideoId="video-1" onEnded={vi.fn()} />);
    await waitFor(() => expect(mockedLoadYoutubeIframeApi).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: 'Play' }));
    expect(fakeYT.playVideo).toHaveBeenCalled();

    act(() => fakeYT.firePlaying());
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Pause' }));
    expect(fakeYT.pauseVideo).toHaveBeenCalled();

    act(() => fakeYT.firePaused());
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('seeks via the seek slider', async () => {
    const fakeYT = installFakeYT();
    render(<VideoPlayer youtubeVideoId="video-1" onEnded={vi.fn()} />);
    await waitFor(() => expect(mockedLoadYoutubeIframeApi).toHaveBeenCalled());

    const seekBar = screen.getByRole('slider', { name: 'Seek' });
    await waitFor(() => expect(seekBar).toHaveAttribute('max', '100'));
    fireEvent.change(seekBar, { target: { value: '42' } });

    expect(fakeYT.seekTo).toHaveBeenCalledWith(42, true);
  });

  it('hides next/previous controls when their handlers are omitted, and disables them when at a queue boundary', async () => {
    installFakeYT();
    const { rerender } = render(<VideoPlayer youtubeVideoId="video-1" onEnded={vi.fn()} />);
    await waitFor(() => expect(mockedLoadYoutubeIframeApi).toHaveBeenCalled());

    expect(screen.getByRole('button', { name: 'Play next video' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Play previous video' })).toBeDisabled();

    rerender(
      <VideoPlayer
        youtubeVideoId="video-1"
        onEnded={vi.fn()}
        onNext={vi.fn()}
        onPrevious={vi.fn()}
        hasNext
        hasPrevious
      />,
    );

    expect(screen.getByRole('button', { name: 'Play next video' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Play previous video' })).toBeEnabled();
  });

  it('calls onNext and onPrevious when their controls are activated', async () => {
    const user = userEvent.setup();
    installFakeYT();
    const handleNext = vi.fn();
    const handlePrevious = vi.fn();
    render(
      <VideoPlayer
        youtubeVideoId="video-1"
        onEnded={vi.fn()}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext
        hasPrevious
      />,
    );
    await waitFor(() => expect(mockedLoadYoutubeIframeApi).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: 'Play next video' }));
    expect(handleNext).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Play previous video' }));
    expect(handlePrevious).toHaveBeenCalled();
  });
});
