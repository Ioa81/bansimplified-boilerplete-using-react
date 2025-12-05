import { supabase } from '@/lib/supebase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      alert('Check your email for the login link!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  const handleOAuthLogin = async (provider: 'google') => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        },
      });
      if (error) throw error;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        alert('Password reset link sent to your email!');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6 space-y-5">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-md px-3 py-2 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailLogin} className="space-y-3">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Submit Button */}
          <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
>
  {loading ? 'Sending...' : 'Send Confirmation Email'}
</button>


          {/* Forgot */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>


        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* OAuth */}
        <div className="space-y-2">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full border border-gray-300 text-gray-700 rounded-md py-2 hover:bg-gray-50 transition text-sm"
          >
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          New here?{' '}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Create an account
          </a>
        </p>

      </div>
    </div>
  );
};

export default LoginForm;
