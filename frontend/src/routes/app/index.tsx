import { createFileRoute } from "@tanstack/react-router";

import {
    CategoriesCardPlaceholder,
    RecentTransactionsCard,
    SummaryCards,
} from "@/features/dashboard/components";

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
            {/* Summary Cards */}
            <SummaryCards month={month!} year={year!} />

            {/* Transactions & Categories Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Categories - Shows first on mobile, second on desktop */}
                <div className="order-1 lg:order-2 lg:col-span-1">
                    <CategoriesCardPlaceholder />
                </div>

                {/* Transactions - Shows second on mobile, first on desktop */}
                <div className="order-2 lg:order-1 lg:col-span-2">
                    <RecentTransactionsCard month={month!} year={year!} />
                </div>
            </div>
        </div>
    );
}