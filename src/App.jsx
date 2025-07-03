import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/router/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import EmployeeDashboard from '@/pages/EmployeeDashboard';
import TicketDetailPage from '@/pages/TicketDetailPage';
import Header from '@/components/Header';
import Registrations from './pages/Registrations';
import { useAuthContext } from './context/AuthContext2';

function App() {
  // const { user, isAuthenticated } = useAuth();
  const {user,token } = useAuthContext()
  return (
    <div className="flex flex-col min-h-screen">
     { token && <Header />    }
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<Registrations />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
               </ProtectedRoute>
            }
          />

          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ticket/:ticketId"
            element={
              <ProtectedRoute allowedRoles={['admin', 'employee']}>
                <TicketDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              token
                ? (user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/employee" />)
                : <Navigate to="/login" />
            }
          />

          <Route path="/unauthorized" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-red-500">Unauthorized</h1>
              <p className="text-gray-300 mt-4">You do not have permission to view this page.</p>
            </div>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;