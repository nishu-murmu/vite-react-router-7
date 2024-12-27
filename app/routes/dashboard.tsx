import { Dashboard } from "~/dashboard/dashboard";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Page" },
    { name: "description", content: "This is a dashboard page" },
  ];
}

export default function DashboardPage() {
  return <Dashboard />;
}
