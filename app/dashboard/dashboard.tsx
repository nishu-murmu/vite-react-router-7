import DashboardForm from "components/generic/DashboardForm";

export function Dashboard() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[600px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center mb-6">
              Dashboard Form
            </p>
            <DashboardForm />
          </nav>
        </div>
      </div>
    </main>
  );
}
