import { isAuthenticated } from "@/lib/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
    component: AppLayout,
    beforeLoad: () => {
        console.log('App: isAuthenticated', isAuthenticated())
        if (!isAuthenticated()) {
            console.log('App: redirecting to /login')
            throw redirect({ to: "/login" })
        }
    },
});

function AppLayout() {
    return (
        <div style={{ padding: 24 }}>
            <h1>Área logada</h1>
            <Outlet />
        </div>
    );
}