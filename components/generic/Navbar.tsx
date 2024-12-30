import useConstants from "hooks/use-constants";
import { NavLink } from "react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/react-router";

export function NavBar() {
  const { NavLinks } = useConstants();
  return (
    <nav className="flex items-center space-x-4">
      {NavLinks.map((link) => {
        if (link.isHidden) return null;
        return (
          <NavLink
            key={link.key}
            to={link.to}
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors
          ${
            isActive
              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
          }`
            }
          >
            {link.name}
          </NavLink>
        );
      })}

      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
        />
      </SignedIn>
    </nav>
  );
}
