import { createFileRoute } from "@tanstack/react-router";

import { SummaryCards } from "@/features/dashboard/components";

interface AppSearchParams {
    month?: number;
    year?: number;
}

function getCurrentMonth(): number {
    return new Date().getMonth() + 1;
}

function getCurrentYear(): number {
    return new Date().getFullYear();
}

export const Route = createFileRoute("/app/")({
    validateSearch: (search: Record<string, unknown>): AppSearchParams => {
        const month = Number(search.month);
        const year = Number(search.year);

        return {
            month:
                !isNaN(month) && month >= 1 && month <= 12
                    ? month
                    : getCurrentMonth(),
            year:
                !isNaN(year) && year >= 2000 && year <= 2100
                    ? year
                    : getCurrentYear(),
        };
    },
    component: AppHome,
});

function AppHome() {
    const { month, year } = Route.useSearch();

    return (
        <div className="space-y-8 pt-6">
            <SummaryCards month={month!} year={year!} />
        </div>
    );
}