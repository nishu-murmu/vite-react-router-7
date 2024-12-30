import type { Route } from ".react-router/types/app/+types/root";
import { isRouteErrorResponse, useNavigate } from "react-router";

export function PageNotFound({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }
  const navigate = useNavigate();

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        {message}
      </h1>
      {message === "404" && (
        <p
          onClick={() => navigate(-1)}
          className="text-gray-600 dark:text-gray-300 mb-4"
        >
          Home Page
        </p>
      )}
      <p className="text-gray-600 dark:text-gray-300 mb-4">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-gray-100 dark:bg-gray-900 rounded-lg">
          <code className="text-gray-800 dark:text-gray-200">{stack}</code>
        </pre>
      )}
    </main>
  );
}
