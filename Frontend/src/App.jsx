import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Task from './pages/Task';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

import './styles/Global.css';

function Layout({ children }) {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/login" element={<LoginRedirectGuard><Login /></LoginRedirectGuard>} /> */}
            <Route path="/register" element={<LoginRedirectGuard><Register /></LoginRedirectGuard>} />

            <Route element={<PrivateRoute />}>
              <Route path="/task" element={<Task />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

function LoginRedirectGuard({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
