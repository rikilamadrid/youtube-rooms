import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { DashboardPage } from './routes/DashboardPage';
import { RoomDetailPage } from './routes/RoomDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
