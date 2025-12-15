// src/pages/AuthCallback.tsx
import { supabase } from '@/lib/supabase';
import { navigateToRole } from '@/utils/redirect';
import {
  clearPendingOAuthSignup,
  clearUserDataFromLocalStorage,
  ensureUserProfile,
  getPendingOAuthSignup,
  saveUserIfRemember
} from '@/utils/user';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for OAuth errors in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const oauthError = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (oauthError) {
          throw new Error(errorDescription || `OAuth error: ${oauthError}`);
        }

        // Get session after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);

          // Check for PKCE errors in URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const hashError = hashParams.get('error');
          const hashErrorDescription = hashParams.get('error_description');

          if (hashError) {
            throw new Error(hashErrorDescription || `Authentication error: ${hashError}`);
          }

          throw sessionError;
        }

        if (!session || !session.user) {
          // No session after OAuth, redirect to login
          await navigate({ to: '/', replace: true });
          return;
        }

        // Get pending OAuth signup data if exists
        const pendingData = getPendingOAuthSignup();
        const formData = pendingData || null;

        if (pendingData) {
          clearPendingOAuthSignup();
        }

        // Ensure user profile exists or create one
        const user = await ensureUserProfile(session, formData);

        // Save user data if "remember me" is enabled
        saveUserIfRemember(user);

        // Navigate based on user role
        await navigateToRole(navigate, user.role || 'customer');

      } catch (err) {
        console.error('Auth callback error:', err);

        const errorMessage = err instanceof Error
          ? err.message
          : 'Authentication failed. Redirecting to login...';

        setError(errorMessage);

        // Clean up local storage on error
        clearPendingOAuthSignup();
        clearUserDataFromLocalStorage();

        // Redirect to login after delay
        setTimeout(() => {
          navigate({ to: '/', replace: true });
        }, 3000);

      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Completing Authentication
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Please wait while we sign you in...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 max-w-md p-6">
          <div className="text-red-600">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="mt-4 text-lg font-semibold">Authentication Failed</h2>
            <p className="mt-2 text-sm text-gray-700">{error}</p>
          </div>
          <div className="text-sm text-gray-500">
            <p>You will be redirected to the login page shortly...</p>
            <p className="mt-1">If redirection doesn't happen, click below.</p>
          </div>
          <button
            onClick={() => navigate({ to: '/', replace: true })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
