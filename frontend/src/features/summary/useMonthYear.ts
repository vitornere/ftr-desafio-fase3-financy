import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/app/index";

function getCurrentMonth(): number {
  return new Date().getMonth() + 1; // 1-12
}

function getCurrentYear(): number {
  return new Date().getFullYear();
}

function validateMonth(value: unknown): number {
  const num = Number(value);
  if (isNaN(num) || num < 1 || num > 12) {
    return getCurrentMonth();
  }
  return Math.floor(num);
}

function validateYear(value: unknown): number {
  const num = Number(value);
  if (isNaN(num) || num < 2000 || num > 2100) {
    return getCurrentYear();
  }
  return Math.floor(num);
}

export interface MonthYear {
  month: number;
  year: number;
}

export function useMonthYear(): MonthYear & {
  setMonthYear: (next: MonthYear) => void;
} {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const month = validateMonth(search.month);
  const year = validateYear(search.year);

  const setMonthYear = (next: MonthYear) => {
    navigate({
      to: "/app",
      search: {
        month: validateMonth(next.month),
        year: validateYear(next.year),
      },
    });
  };

  return { month, year, setMonthYear };
}
