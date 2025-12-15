import { createRootRoute, Outlet } from "@tanstack/react-router";
import { adminRoutes } from "./routers/dash.route";
import { customerRoutes } from "./routers/root.route";

// Use Outlet directly as the root component
export const rootRoute = createRootRoute({
  component: Outlet,
});

export const routeTree = rootRoute.addChildren([
  ...customerRoutes,
  adminRoutes,
]);
