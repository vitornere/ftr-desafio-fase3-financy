import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
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