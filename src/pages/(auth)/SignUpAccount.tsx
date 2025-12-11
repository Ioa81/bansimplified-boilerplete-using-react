import { supabase } from '@/lib/supabase';
import { buildRedirect } from '@/utils/redirect';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const validateForm = (): boolean => {
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms & Conditions to continue.');
      return false;
    }

    return true;
  };

  const handleMagicLinkSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: buildRedirect('/auth/callback'),
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess('Magic link sent! Please check your email to complete registration.');

      // Reset form after success
      setTimeout(() => {
        setEmail('');
        setAcceptTerms(false);
      }, 3000);

    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-sm text-gray-600">Sign up with your email</p>
        </div>

        { success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            { success }
          </div>
        ) }

        { error && !success && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            { error }
          </div>
        ) }

        <form onSubmit={ handleMagicLinkSignup } className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={ email }
              onChange={ (e) => setEmail(e.target.value) }
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50"
              disabled={ loading }
            />
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              id="terms"
              type="checkbox"
              checked={ acceptTerms }
              onChange={ (e) => setAcceptTerms(e.target.checked) }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              disabled={ loading }
            />
            <label htmlFor="terms" className="text-sm text-gray-700 leading-tight">
              I agree to the{ ' ' }
              <a href="/terms" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Terms & Conditions
              </a>{ ' ' }
              and{ ' ' }
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={ loading }
            className="w-full rounded-lg bg-blue-600 text-white py-3.5 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            { loading && <Loader2 className="h-4 w-4 animate-spin" /> }
            { loading ? 'Sending...' : 'Sign Up with Email' }
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">
            Already have an account?{ ' ' }
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
              Sign in here
            </Link>
          </p>

          <div className="flex justify-center space-x-5">
            <a href="/terms" className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Privacy
            </a>
            <a href="/contact" className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
