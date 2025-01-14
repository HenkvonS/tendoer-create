type SortField = "title" | "organization" | "deadline" | "budget" | "status";
type SortOrder = "asc" | "desc";

export type SortConfig = {
  field: SortField;
  order: SortOrder;
};

export const sortTenders = (
  tenders: any[],
  { field, order }: SortConfig
) => {
  return [...tenders].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "title":
      case "organization":
      case "status":
        comparison = a[field].localeCompare(b[field]);
        break;
      case "deadline":
        comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        break;
      case "budget":
        const budgetA = parseFloat(a.budget.replace(/[^0-9.-]+/g, ""));
        const budgetB = parseFloat(b.budget.replace(/[^0-9.-]+/g, ""));
        comparison = budgetA - budgetB;
        break;
      default:
        comparison = 0;
    }

    return order === "asc" ? comparison : -comparison;
  });
};