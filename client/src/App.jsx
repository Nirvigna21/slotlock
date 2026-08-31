import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import ManageResources from './pages/ManageResources';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/manage" element={<ProtectedRoute roles={['owner', 'admin']}><ManageResources /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
