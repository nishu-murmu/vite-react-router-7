import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect } from "react-router";
import { privateRoutes } from "~/utils/config";
import type { Route } from "../+types/root";

const useMiddleware = async ({ args }: { args: Route.LoaderArgs }) => {
  const { userId } = await getAuth(args);
  const pathname = new URL(args.request.url).pathname;
  if (!userId && !privateRoutes.every((r) => r.startsWith(pathname))) {
    throw redirect("/");
  }

  return {
    user: {},
  };
};

export default useMiddleware;
