import { graphql } from "@/graphql/gql";

export const DashboardSummaryQuery = graphql(`
  query DashboardSummary($month: Int!, $year: Int!) {
    dashboardSummary(month: $month, year: $year) {
      balanceCents
      incomeMonthCents
      expenseMonthCents
    }
  }
`);
