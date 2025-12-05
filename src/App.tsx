import Dashboard from '@/app/admin/Dashboard';
import AuthCallback from '@/app/auth/AuthCallback';
import LoginAccount from '@/app/auth/LoginAccount';
import SignupForm from '@/app/auth/SignUpAccount';
import Index from '@/app/user/Index';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={ <LoginAccount /> } />
        <Route path='/index' element={ <Index/>} />
        <Route path="/auth/callback" element={ <AuthCallback /> } />
        <Route path="/dashboard" element={ <Dashboard /> } />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  );
}

export default App;
