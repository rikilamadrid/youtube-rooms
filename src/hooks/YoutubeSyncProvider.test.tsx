import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useYoutubeSyncContext } from './YoutubeSyncContext';
import { YoutubeSyncProvider } from './YoutubeSyncProvider';

function Probe() {
  const { status } = useYoutubeSyncContext();
  return <div>status: {status}</div>;
}

describe('YoutubeSyncProvider', () => {
  it('provides useYoutubeSync state to descendants', () => {
    render(
      <YoutubeSyncProvider>
        <Probe />
      </YoutubeSyncProvider>,
    );

    expect(screen.getByText('status: disconnected')).toBeInTheDocument();
  });

  it('throws a clear error when useYoutubeSyncContext is used outside the provider', () => {
    expect(() => render(<Probe />)).toThrow('useYoutubeSyncContext must be used within a YoutubeSyncProvider');
  });
});
