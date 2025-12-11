import Home from "@/pages/(root)/Index"
import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../_root"

export const RootRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/index",
    component: Home
})
