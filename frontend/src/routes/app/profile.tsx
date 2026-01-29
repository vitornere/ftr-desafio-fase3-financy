import { createFileRoute } from "@tanstack/react-router"

import { ProfileCard } from "@/features/profile/components"

export const Route = createFileRoute("/app/profile")({
    component: ProfilePage,
})

/**
 * Profile page - Displays user profile with editable name.
 * Centered card layout similar to auth pages.
 */
function ProfilePage() {
    return (
        <div className="flex min-h-[calc(100vh-69px-3rem)] items-center justify-center p-6">
            <ProfileCard />
        </div>
    )
}
