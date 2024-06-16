import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import type { AuthContext } from "../auth";

export const Route = createRootRouteWithContext<{
  auth: AuthContext;
}>()({
  component: () => (
    <>
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/new-user" className="[&.active]:font-bold">
          New User
        </Link>
        <Link to="/my-games" className="[&.active]:font-bold">
          My Games
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
