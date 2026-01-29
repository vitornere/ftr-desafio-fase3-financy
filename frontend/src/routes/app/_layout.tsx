import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/app/_layout")({
    beforeLoad: () => {
        if (!isAuthenticated()) {
            throw redirect({ to: "/login" });
        }
    },
    component: AppLayout,
});

function AppLayout() {
    return (
        <div style={{ padding: 24 }}>
            <h1>Área logada</h1>
            <Outlet />
        </div>
    );
}