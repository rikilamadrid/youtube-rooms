import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { YoutubeSyncProvider } from '../hooks/YoutubeSyncProvider';
import { AppShell } from './AppShell';
import { ChannelsPage } from './routes/ChannelsPage';
import { DashboardPage } from './routes/DashboardPage';
import { RoomDetailPage } from './routes/RoomDetailPage';
import { SettingsPage } from './routes/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <YoutubeSyncProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </YoutubeSyncProvider>
    </BrowserRouter>
  );
}

export default App;
