import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useStore } from './store';
import TabBar from './components/TabBar';
import Login from './pages/Login';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Search from './pages/Search';
import Consultation from './pages/Consultation';
import Profile from './pages/Profile';

const ProtectedRoute: React.FC = () => {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const MainLayout: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Outlet />
    </div>
    <TabBar />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/search" element={<Search />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
