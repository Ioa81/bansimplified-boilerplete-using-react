// src/pages/AuthCallback.tsx
import { supabase } from '@/lib/supabase';
import { useNavigate } from '@tanstack/react-router';
import { navigateToRole } from '@utils/redirect';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // --- Get current session from Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const session = sessionData.session;
        if (!session || !session.user) {
          await navigate({ to: '/', replace: true });
          return;
        }

        const userId = session.user.id;

        // --- Retrieve any pending OAuth signup data
        const pendingDataStr = localStorage.getItem('pendingOAuthSignup');
        const formData = pendingDataStr ? JSON.parse(pendingDataStr) : null;
        if (pendingDataStr) localStorage.removeItem('pendingOAuthSignup');

        const { data: existingUser, error: profileError } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', userId)
          .maybeSingle(); // <-- returns null if not found, instead of throwing

        if (profileError) {
          throw profileError;
        }

        let role = existingUser?.role;

        // --- If user not found, create profile from OAuth metadata or pending form
        if (!existingUser) {
          const metadata = session.user.user_metadata || {};
          const userProfile = {
            id: userId,
            email: session.user.email,
            firstname: formData?.firstname || metadata.full_name?.split(' ')[0] || 'User',
            lastname: formData?.lastname || metadata.full_name?.split(' ').slice(1).join(' ') || '',
            phone: formData?.phone || metadata.phone || null,
            address: formData?.address || metadata.address || null,
            city: formData?.city || metadata.city || null,
            zipcode: formData?.zipcode || metadata.zipcode || null,
            role: 'customer',
          };

          const { error: upsertError } = await supabase
            .from('users')
            .upsert(userProfile, { onConflict: 'id' });

          if (upsertError) {
            console.error('Failed to upsert user profile:', upsertError);
            await supabase.auth.updateUser({ data: { ...userProfile } });
          }

          role = 'customer';
        }

        // --- Redirect based on role
        await navigateToRole(navigate, role);
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Redirecting...');
        setTimeout(() => {
          localStorage.removeItem('pendingOAuthSignup');
          navigate({ to: '/register', replace: true });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{ error }</p>
          <p className="mt-2 text-sm text-gray-600">Redirecting to signup page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
