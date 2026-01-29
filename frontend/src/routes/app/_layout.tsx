import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_layout")({
    beforeLoad: () => {
        const token = localStorage.getItem("token");
        if (!token) {
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