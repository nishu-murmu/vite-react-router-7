import { NavLink } from "react-router";
import { AppRoutes } from "utils/config";

export function NavBar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-gray-800">Brand</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <NavLink
              to={AppRoutes.home}
              end
              className={({ isActive }) =>
                `text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive ? "bg-gray-100 text-gray-900" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to={AppRoutes.dashboard}
              end
              className={({ isActive }) =>
                `text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive ? "bg-gray-100 text-gray-900" : ""}`
              }
            >
              Dashboard
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
