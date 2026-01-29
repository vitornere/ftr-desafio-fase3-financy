import { isAuthenticated } from "@/lib/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout";

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
        <div className="min-h-screen bg-background">
            <AppHeader />
            <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-12 2xl:px-16">
                <Outlet />
            </main>
        </div>
    );
}