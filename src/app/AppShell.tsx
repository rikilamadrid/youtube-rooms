import { Link, Outlet } from 'react-router-dom';
import './AppShell.css';

/**
 * App-wide header/nav frame. Wraps route content via `Outlet` so every
 * page shares the same brand header and content container.
 */
export function AppShell() {
  return (
    <div className="sr-app-shell">
      <header className="sr-app-shell__header">
        <Link to="/" className="sr-app-shell__brand">
          SubRooms
        </Link>
      </header>
      <main className="sr-app-shell__content">
        <Outlet />
      </main>
    </div>
  );
}
