import { supabase } from '@/lib/supebase';
import { redirectByRole } from '@/utils/redirectByRole';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';


const SignupForm: React.FC = () => {
  // Form states matching your users table structure
  const [email, setEmail] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {

        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        navigate(redirectByRole(data?.role), { replace: true });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);


  // Handle OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setError('OAuth registration failed. Please try again.');
      navigate('/signup', { replace: true });
      return;
    }

    if (code) {
      setLoading(true);
      supabase.auth.exchangeCodeForSession(code).finally(() => setLoading(false));
    }
  }, [searchParams, navigate]);

  const validateForm = (): boolean => {
    // Clear previous errors
    setError(null);

    // Check required fields
    if (!email || !firstname || !lastname) {
      setError('Please fill in all required fields (marked with *).');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Validate phone if provided
    if (phone && phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number.');
      return false;
    }

    // Check terms acceptance
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
          data: {
            firstname,
            lastname,
            phone: phone || null,
            address: address || null,
            city: city || null,
            zipcode: zipcode || null,
            role: 'customer',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess('Magic link sent! Please check your email to complete registration.');

      // Clear form after successful submission
      setTimeout(() => {
        setEmail('');
        setFirstname('');
        setLastname('');
        setPhone('');
        setAddress('');
        setCity('');
        setZipcode('');
        setAcceptTerms(false);
      }, 3000);

    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: 'google') => {
    setLoading(true);
    setError(null);

    // Store the form data in localStorage so we can access it after OAuth redirect
    const formData = {
      firstname,
      lastname,
      phone,
      address,
      city,
      zipcode,
    };

    localStorage.setItem('pendingOAuthSignup', JSON.stringify(formData));

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        localStorage.removeItem('pendingOAuthSignup');
        throw error;
      }


    } catch (err) {
      localStorage.removeItem('pendingOAuthSignup');
      setError((err as Error).message);
      setLoading(false);
    }
  };

  // Auto-format phone number
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign up to get started
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleMagicLinkSignup} className="space-y-4">
          {/* Two-column layout for name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* First Name */}
            <div>
              <label htmlFor="firstname" className="block text-xs font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                placeholder="John"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={loading}
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastname" className="block text-xs font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                placeholder="Doe"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={loading}
            />
          </div>

          {/* Contact Information Section */}
          <div className="pt-3 border-t border-gray-200">
            <h3 className="text-gray-700 font-medium mb-3 text-sm">Contact Information (Optional)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  placeholder="(123) 456-7890"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={loading}
                  maxLength={14}
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-3">
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={loading}
                />
              </div>

              {/* Zip Code */}
              <div className="mt-3">
                <label htmlFor="zipcode" className="block text-xs font-medium text-gray-700 mb-1">
                  Zip/Postal Code
                </label>
                <input
                  id="zipcode"
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  placeholder="10001"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={loading}
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="terms" className="text-xs text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading && <Loader2 className="h-3 w-3 animate-spin" />}
            {loading ? 'Sending...' : 'Sign Up with Email'}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Social Signup Buttons */}
        <div className="mt-4">
          <button
            onClick={() => handleOAuthSignup('google')}
            disabled={loading}
            className="w-full border border-gray-300 text-gray-700 rounded-md py-2.5 hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            Sign in here
          </Link>
        </p>

        <div className="mt-4 flex justify-center space-x-4">
          <a href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Terms
          </a>
          <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Privacy
          </a>
          <a href="/contact" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Contact
          </a>
        </div>

      </div>
    </div>
  );
};

export default SignupForm;
