const YOUTUBE_READONLY_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';
const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const GIS_SCRIPT_ID = 'google-identity-services';
const TOKEN_EXPIRY_BUFFER_MS = 60_000;

export type YoutubeAuthErrorCode = 'not-configured' | 'popup-closed' | 'access-denied' | 'network' | 'unknown';

export class YoutubeAuthError extends Error {
  code: YoutubeAuthErrorCode;

  constructor(code: YoutubeAuthErrorCode, message: string) {
    super(message);
    this.name = 'YoutubeAuthError';
    this.code = code;
  }
}

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

interface GisTokenClient {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
}

interface GisOauth2 {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: GisTokenResponse) => void;
    error_callback?: (error: GisClientError) => void;
  }) => GisTokenClient;
  revoke: (accessToken: string, done?: () => void) => void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: GisOauth2;
      };
    };
  }
}

interface TokenState {
  accessToken: string;
  expiresAt: number;
}

let tokenState: TokenState | null = null;
let gisLoadPromise: Promise<void> | null = null;

function getClientId(): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new YoutubeAuthError(
      'not-configured',
      'YouTube sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID in your local environment.',
    );
  }
  return clientId;
}

function loadGisScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }
  if (gisLoadPromise) {
    return gisLoadPromise;
  }
  gisLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(GIS_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new YoutubeAuthError('network', 'Failed to load Google sign-in. Check your connection and try again.')),
      );
      return;
    }
    const script = document.createElement('script');
    script.id = GIS_SCRIPT_ID;
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new YoutubeAuthError('network', 'Failed to load Google sign-in. Check your connection and try again.'));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    gisLoadPromise = null;
    throw error;
  });
  return gisLoadPromise;
}

function mapTokenResponseError(response: GisTokenResponse): YoutubeAuthError {
  if (response.error === 'access_denied') {
    return new YoutubeAuthError('access-denied', 'YouTube access was not granted.');
  }
  return new YoutubeAuthError('unknown', response.error_description ?? 'Sign-in with YouTube failed.');
}

function mapClientError(error: GisClientError): YoutubeAuthError {
  if (error.type === 'popup_closed' || error.type === 'popup_failed_to_open') {
    return new YoutubeAuthError(
      'popup-closed',
      'The sign-in window was closed before completing. Check your browser’s popup settings and try again.',
    );
  }
  return new YoutubeAuthError('unknown', error.message ?? 'Sign-in with YouTube failed.');
}

async function requestToken(prompt: '' | 'consent'): Promise<TokenState> {
  const clientId = getClientId();
  await loadGisScript();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) {
    throw new YoutubeAuthError('unknown', 'Google sign-in failed to initialize.');
  }

  return new Promise<TokenState>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: YOUTUBE_READONLY_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(mapTokenResponseError(response));
          return;
        }
        resolve({
          accessToken: response.access_token,
          expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000,
        });
      },
      error_callback: (error) => {
        reject(mapClientError(error));
      },
    });
    client.requestAccessToken({ prompt });
  });
}

/** Explicit, user-initiated sign-in — always shows the Google consent prompt. */
export async function connectYoutubeAccount(): Promise<void> {
  tokenState = await requestToken('consent');
}

/** Returns a valid access token, silently refreshing it if the cached one has expired. */
export async function getYoutubeAccessToken(): Promise<string> {
  if (tokenState && tokenState.expiresAt - TOKEN_EXPIRY_BUFFER_MS > Date.now()) {
    return tokenState.accessToken;
  }
  tokenState = await requestToken('');
  return tokenState.accessToken;
}

export function isYoutubeConnected(): boolean {
  return tokenState !== null;
}

export async function disconnectYoutubeAccount(): Promise<void> {
  const oauth2 = window.google?.accounts?.oauth2;
  if (tokenState && oauth2) {
    await new Promise<void>((resolve) => oauth2.revoke(tokenState!.accessToken, () => resolve()));
  }
  tokenState = null;
}

/** Test-only: resets in-memory auth state between test cases. */
export function __resetYoutubeAuthStateForTests(): void {
  tokenState = null;
  gisLoadPromise = null;
}
