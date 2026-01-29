import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
    component: AppHome,
});

function AppHome() {
    return <div>Dashboard</div>;
}