import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect } from "react-router";
import { privateRoutes } from "utils/config";
import type { Route } from "../app/+types/root";

const useMiddleware = async ({ args }: { args: Route.LoaderArgs }) => {
  const { userId } = await getAuth(args);
  const pathname = new URL(args.request.url).pathname;

  if (!userId && privateRoutes.includes(pathname)) {
    console.log("called inside", pathname);
    throw redirect("/"); // Changed: throw the redirect instead of just calling it
  }

  return {
    user: {},
  };
};

export default useMiddleware;
