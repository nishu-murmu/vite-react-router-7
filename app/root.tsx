import { ClerkProvider } from "@clerk/react-router";
import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { neobrutalism } from "@clerk/themes";
import { PageNotFound } from "~/components/generic/PageNotFound";
import { ThemeProvider } from "~/components/generic/ThemeProvider";
import MainLayout from "~/layouts/MainLayout";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import useMiddleware from "./hooks/use-middleware";

export async function loader(args: Route.LoaderArgs) {
  await useMiddleware({ args });
  return rootAuthLoader(args);
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen text-gray-900 bg-white transition-colors dark:bg-gray-950 dark:text-gray-50">
        <ThemeProvider>{children}</ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ClerkProvider
      loaderData={loaderData}
      signUpFallbackRedirectUrl="/"
      signInFallbackRedirectUrl="/"
      appearance={{
        baseTheme: neobrutalism,
      }}
    >
      <MainLayout />
    </ClerkProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <PageNotFound params={{}} error={error} />;
}
