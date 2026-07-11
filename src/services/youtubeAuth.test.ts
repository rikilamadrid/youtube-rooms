import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  YoutubeAuthError,
  __resetYoutubeAuthStateForTests,
  connectYoutubeAccount,
  disconnectYoutubeAccount,
  getYoutubeAccessToken,
  isYoutubeConnected,
} from './youtubeAuth';

interface GisTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

interface GisClientError {
  type: string;
  message?: string;
}

function installGisMock() {
  const initTokenClient = vi.fn(
    (config: { callback: (response: GisTokenResponse) => void; error_callback?: (error: GisClientError) => void }) => ({
      requestAccessToken: vi.fn(() => {
        const behavior = nextBehavior.shift();
        if (!behavior) {
          throw new Error('No queued GIS behavior for requestAccessToken call.');
        }
        behavior(config);
      }),
    }),
  );
  const revoke = vi.fn((_token: string, done?: () => void) => done?.());

  window.google = { accounts: { oauth2: { initTokenClient, revoke } } };

  return { initTokenClient, revoke };
}

type QueuedBehavior = (config: {
  callback: (response: GisTokenResponse) => void;
  error_callback?: (error: GisClientError) => void;
}) => void;

let nextBehavior: QueuedBehavior[] = [];

function queueSuccess(accessToken: string, expiresIn = 3600) {
  nextBehavior.push((config) => config.callback({ access_token: accessToken, expires_in: expiresIn }));
}

function queueTokenError(error: string) {
  nextBehavior.push((config) => config.callback({ error }));
}

function queueClientError(type: string) {
  nextBehavior.push((config) => config.error_callback?.({ type }));
}

describe('youtubeAuth', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'test-client-id');
    nextBehavior = [];
    installGisMock();
  });

  afterEach(() => {
    __resetYoutubeAuthStateForTests();
    delete window.google;
    vi.unstubAllEnvs();
  });

  it('connects and reports the account as connected', async () => {
    queueSuccess('token-abc');

    await connectYoutubeAccount();

    expect(isYoutubeConnected()).toBe(true);
    await expect(getYoutubeAccessToken()).resolves.toBe('token-abc');
  });

  it('reuses a cached token without requesting a new one while it is still valid', async () => {
    const { initTokenClient } = installGisMock();
    queueSuccess('token-abc');

    await connectYoutubeAccount();
    await getYoutubeAccessToken();

    expect(initTokenClient).toHaveBeenCalledTimes(1);
  });

  it('silently refreshes an expired token', async () => {
    queueSuccess('token-abc', -1);
    await connectYoutubeAccount();

    queueSuccess('token-refreshed');
    await expect(getYoutubeAccessToken()).resolves.toBe('token-refreshed');
  });

  it('maps access_denied to a YoutubeAuthError with code access-denied', async () => {
    queueTokenError('access_denied');

    await expect(connectYoutubeAccount()).rejects.toMatchObject({
      code: 'access-denied',
    } satisfies Partial<YoutubeAuthError>);
  });

  it('maps a closed popup to a YoutubeAuthError with code popup-closed', async () => {
    queueClientError('popup_closed');

    await expect(connectYoutubeAccount()).rejects.toMatchObject({
      code: 'popup-closed',
    } satisfies Partial<YoutubeAuthError>);
  });

  it('throws not-configured when no client id is set', async () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', '');

    await expect(connectYoutubeAccount()).rejects.toMatchObject({
      code: 'not-configured',
    } satisfies Partial<YoutubeAuthError>);
  });

  it('revokes the token and clears connected state on disconnect', async () => {
    const { revoke } = installGisMock();
    queueSuccess('token-abc');
    await connectYoutubeAccount();

    await disconnectYoutubeAccount();

    expect(revoke).toHaveBeenCalledWith('token-abc', expect.any(Function));
    expect(isYoutubeConnected()).toBe(false);
  });
});
