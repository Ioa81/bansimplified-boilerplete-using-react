import { supabase } from "@/lib/supabase";
import { Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const useUserData = () => {
  const [userData, setUserData] = useState<{
    role: string | null;
    status: string | null;
    id: string | null;
  }>({ role: null, status: null, id: null });
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setHasSession(true);
          const { data } = await supabase
            .from('users')
            .select('role, status, id')
            .eq('id', session.user.id)
            .single();

          setUserData({
            role: data?.role || null,
            status: data?.status || null,
            id: session.user.id
          });
        } else {
          setHasSession(false);
          setUserData({ role: null, status: null, id: null });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setHasSession(false);
        setUserData({ role: null, status: null, id: null });
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { userData, hasSession, isLoading };
};

export default function RootLayoutDashboard() {
  const { userData, hasSession, isLoading } = useUserData();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-600"></div>
      </div>
    );
  }

  const isActive = userData.status === 'active';
  const isCustomer = userData.role === 'customer' && isActive;
  const isElevated = userData.role && ['admin', 'manager', 'staff'].includes(userData.role) && isActive;

  // Don't show navbar/footer if no user or user is not active
  const showNavbar = hasSession && isActive;
  const showFooter = hasSession && isActive;

  return (
    <div className="min-h-screen flex flex-col">
      <main className={`flex-1 ${showNavbar ? 'pt-16' : ''}`}>
        <Outlet />
      </main>

    </div>
  );
}
