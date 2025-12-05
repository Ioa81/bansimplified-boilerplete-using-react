import Dashboard from '@/app/admin/Dashboard';
import AuthCallback from '@/app/auth/AuthCallback';
import LoginAccount from '@/app/auth/LoginAccount';
import SignupForm from '@/app/auth/SignUpAccount';
import ContactPage from '@/app/infromation/Contact';
import PrivacyPage from '@/app/infromation/Privacy';
import TermsPage from '@/app/infromation/Terms';
import Index from '@/app/user/Index';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAccount />} />
        <Route path="/index" element={<Index />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Informational Pages */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;
