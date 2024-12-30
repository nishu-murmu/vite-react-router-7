// components/ThemeSwitcher.tsx
import { Moon, Sun, Computer } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
          theme === "light"
            ? "text-yellow-500"
            : "text-gray-500 dark:text-gray-400"
        }`}
        aria-label="Light mode"
      >
        <Sun className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
          theme === "dark"
            ? "text-blue-500"
            : "text-gray-500 dark:text-gray-400"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
          theme === "system"
            ? "text-green-500"
            : "text-gray-500 dark:text-gray-400"
        }`}
        aria-label="System theme"
      >
        <Computer className="w-5 h-5" />
      </button>
    </div>
  );
}
