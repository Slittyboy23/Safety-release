import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReleaseForm from './pages/ReleaseForm';
import ThankYou from './pages/ThankYou';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReleaseForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
