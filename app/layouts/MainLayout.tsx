import { Link, Outlet } from "react-router";
import { AppRoutes } from "~/utils/config";
import { NavBar } from "~/components/generic/Navbar";

const MainLayout = () => {
  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between py-8 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <Link
          to={AppRoutes.home}
          className="text-xl font-bold text-gray-900 dark:text-gray-50"
        >
          Booksville
        </Link>
        <div className="flex items-center gap-4">
          <NavBar />
        </div>
      </header>
      <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-gray-950">
        <Outlet />
      </main>
    </>
  );
};
export default MainLayout;
