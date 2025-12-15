import { supabase } from "@/lib/supabase";
import { authMiddleware } from "@/utils/authMiddleware";
import { createRoute, redirect } from "@tanstack/react-router";
import { lazy } from "react";
import { rootRoute } from "../_root";

// Lazy pages for customers
const Index = lazy(() => import('@/pages/(root)/Index'));
const PrivacyPage = lazy(() => import('@/pages/(information)/Privacy'));
const TermsPage = lazy(() => import('@/pages/(information)/Terms'));

// Public / customer routes
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/index',
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data: user } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    const role = user?.role || 'customer';
    if (['admin', 'manager', 'staff'].includes(role)) throw redirect({ to: '/dashboard' });
  },
  component: Index,
});

export const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/privacy', component: PrivacyPage });
export const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/terms', component: TermsPage });

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: async ({ location }) => {
    const result = await authMiddleware(location.pathname);
    if (result) throw redirect({ to: ['admin', 'manager', 'staff'].includes(result.role) ? '/dashboard' : '/index' });
  },
  component: lazy(() => import('@/pages/(auth)/LoginAccount')),
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  beforeLoad: async ({ location }) => {
    const result = await authMiddleware(location.pathname);
    if (result) throw redirect({ to: ['admin', 'manager', 'staff'].includes(result.role) ? '/dashboard' : '/index' });
  },
  component: lazy(() => import('@/pages/(auth)/SignUpAccount')),
});

export const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: lazy(() => import('@/pages/(auth)/AuthCallback')),
});

export const customerRoutes = [
  indexRoute,
  privacyRoute,
  termsRoute,
  loginRoute,
  registerRoute,
  authCallbackRoute,
];
