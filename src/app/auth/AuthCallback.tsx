// src/pages/AuthCallback.tsx
import { supabase } from '@/lib/supebase';
import { redirectByRole } from '@/utils/redirectByRole';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
          navigate('/', { replace: true });
          return;
        }

        // --- Retrieve any pending OAuth data
        const pendingDataStr = localStorage.getItem('pendingOAuthSignup');
        let formData = null;

        if (pendingDataStr) {
          formData = JSON.parse(pendingDataStr);
          localStorage.removeItem('pendingOAuthSignup');
        }

        // --- Check if profile exists
        const { data: existingUser, error: profileError } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', session.user.id)
          .single();

        let role = existingUser?.role;

        // --- If profile missing, create it
        if (profileError && profileError.code === 'PGRST116') {
          const userMetadata = session.user.user_metadata;

          const userProfile = {
            id: session.user.id,
            email: session.user.email,
            firstname: formData?.firstname ||
              userMetadata.full_name?.split(' ')[0] ||
              userMetadata.firstname ||
              'User',
            lastname: formData?.lastname ||
              userMetadata.full_name?.split(' ').slice(1).join(' ') ||
              userMetadata.lastname ||
              '',
            phone: formData?.phone || userMetadata.phone || null,
            address: formData?.address || userMetadata.address || null,
            city: formData?.city || userMetadata.city || null,
            zipcode: formData?.zipcode || userMetadata.zipcode || null,
            role: 'customer',
          };

          const { error: insertError } = await supabase.from('users').insert(userProfile);

          if (insertError) {
            console.error('Profile insert failed:', insertError);

            await supabase.auth.updateUser({
              data: {
                firstname: userProfile.firstname,
                lastname: userProfile.lastname,
                phone: userProfile.phone,
                address: userProfile.address,
                city: userProfile.city,
                zipcode: userProfile.zipcode,
                role: 'customer',
              }
            });
          }

          role = 'customer';
        }

        // --- FINAL REDIRECT BASED ON ROLE
        navigate(redirectByRole(role), { replace: true });

      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');

        setTimeout(() => {
          localStorage.removeItem('pendingOAuthSignup');
          navigate('/signup', { replace: true });
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
          <p>{error}</p>
          <p className="mt-2 text-sm text-gray-600">Redirecting to signup page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
