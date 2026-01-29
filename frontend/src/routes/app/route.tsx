import { clearTokens, getRefreshToken, getToken } from "@/lib/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout";
import { DevSeedButton } from "@/features/dev-seed";
import { isJwtExpired } from "@/lib/jwt";
import { performTokenRefresh } from "@/lib/refreshToken";

export const Route = createFileRoute("/app")({
    component: AppLayout,
    beforeLoad: async () => {
        const token = getToken()
        const refresh = getRefreshToken()

        if (!token && !refresh) throw redirect({ to: "/login" })

        if (token && isJwtExpired(token) && refresh) {
            try {
                await performTokenRefresh()
            } catch {
                clearTokens()
                throw redirect({ to: "/login" })
            }
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
            {/* DEV ONLY: Floating button to seed test data */}
            <DevSeedButton />
        </div>
    );
}