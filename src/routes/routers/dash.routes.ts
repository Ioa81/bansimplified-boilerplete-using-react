// Route Result http://localhost:5173/dashboard
import Dashboard from "@/pages/(dashboard)/Dashboard";
import { createRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../_root";

export const DashboardRoute = createRoute({
    getParentRoute: () => DashboardLayout,
    path: "/",
    component: Dashboard
})
