import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AppShell.css';

/**
 * App-wide header/nav frame. Wraps route content via `Outlet` so every
 * page shares the same brand header and content container.
 */
export function AppShell() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // Route changes unmount the control that triggered navigation (e.g. a
    // RoomCard rendered as a button), which drops keyboard focus to
    // `document.body`. Move it to the new page's content instead of
    // silently losing the user's position. Comparing against the previous
    // pathname (rather than a mount flag) keeps this correct under
    // StrictMode's double effect invocation in development.
    if (previousPathname.current !== null && previousPathname.current !== pathname) {
      mainRef.current?.focus();
    }
    previousPathname.current = pathname;
  }, [pathname]);

  return (
    <div className="sr-app-shell">
      <header className="sr-app-shell__header">
        <Link to="/" className="sr-app-shell__brand">
          SubRooms
        </Link>
        <nav className="sr-app-shell__nav" aria-label="Primary">
          <Link to="/channels" className="sr-app-shell__nav-link">
            Channels
          </Link>
          <Link to="/settings" className="sr-app-shell__nav-link">
            Settings
          </Link>
        </nav>
      </header>
      <main className="sr-app-shell__content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
