import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/admin-app/hooks/useAuth';
import LoginPage from '@/admin-app/pages/Login';
import AdminDashboard from '@/admin-app/pages/AdminDashboard';

function AdminAppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    document.documentElement.classList.add('light');
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboard/*"
        element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/admin/dashboard' : '/admin/login'} replace />} />
    </Routes>
  );
}

function AdminApp() {
  return (
    <AuthProvider>
      <AdminAppContent />
    </AuthProvider>
  );
}

export default AdminApp;
