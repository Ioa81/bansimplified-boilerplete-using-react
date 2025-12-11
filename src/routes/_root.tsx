import { authMiddleware } from "@/middleware/authMiddleware";
import { NotFound } from "@/pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { DashboardRoute } from "./routers/dash.routes";
import { RootRoute } from "./routers/root.route";

import LoginForm from "@/pages/(auth)/LoginAccount";
import RegisterForm from "@/pages/(auth)/SignUpAccount";
import AuthCallback from "@/pages/(auth)/AuthCallback";

const queryClient = new QueryClient();

// Root route
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => <NotFound />,
});

// Dashboard layout
export const DashboardLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: async ({ location }) => {
    await authMiddleware(location.pathname);
  },
  component: () => (
    <QueryClientProvider client={ queryClient }>
      <Outlet />
    </QueryClientProvider>
  ),
});

// Auth routes
export const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginForm,
});

export const RegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterForm,
});

export const AuthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/callback",
  component: AuthCallback,
});

// Build router tree
export const routerTree = rootRoute.addChildren([
  LoginRoute,
  RegisterRoute,
  AuthCallbackRoute,
  RootRoute,
  DashboardLayout.addChildren([DashboardRoute]),
]);
