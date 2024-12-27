import DashboardLayout from "layouts/DashboardLayout";
import { Outlet } from "react-router";
import type { Route } from "../+types/root";
import { Dashboard } from "~/dashboard/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Page" },
    { name: "description", content: "This is a dashboard page" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  let title = formData.get("title");
  let author = formData.get("author");
  const response = await fetch("http://localhost:3000/api/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, author }),
  }).then((res) => res.json());
  return response;
}

export default function DashboardPage({ actionData }: Route.ComponentProps) {
  console.log("🚀 ~ DashboardPage ~ actionData:", actionData);
  return (
    <>
      <DashboardLayout />
      <Outlet />
      <Dashboard />
    </>
  );
}
