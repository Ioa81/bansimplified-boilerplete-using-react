import { createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";
import { rootRoute } from "../_root";

const Dashboard = lazy(() => import('@/pages/(dashboard)/Dashboard'));

export const dashboardLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Outlet
});

export const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayout,
  path: '/',
  component: Dashboard,
});

export const adminRoutes = dashboardLayout.addChildren([dashboardIndexRoute]);
