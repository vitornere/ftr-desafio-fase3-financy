import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/")({
    beforeLoad: () => {
        console.log('Index: isAuthenticated', isAuthenticated())
        console.log('Index: redirecting to', isAuthenticated() ? "/app" : "/login")
        throw redirect({ to: isAuthenticated() ? "/app" : "/login" });
    },
});