import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PropertyForm from './components/PropertyForm';
import AdminPanel from './pages/AdminPanel';

// Protected Route component - only shows if logged in
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
}

// Role-based route - only shows for ADMIN
function AdminRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" />;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'ADMIN') {
            return <Navigate to="/dashboard" />;
        }
    } catch (e) {
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/add-property" element={
                        <ProtectedRoute>
                            <PropertyForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminPanel />
                        </AdminRoute>
                    } />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;