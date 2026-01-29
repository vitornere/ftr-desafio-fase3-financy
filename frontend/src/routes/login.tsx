import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/login")({
    beforeLoad: () => {
        if (isAuthenticated()) {
            throw redirect({ to: "/app" });
        }
    },
    component: LoginPage,
});

function LoginPage() {
    return (
        <div style={{ padding: 24 }}>
            <h1>Login</h1>
            {/* aqui você coloca seu form (react-hook-form + zod) */}
        </div>
    );
}