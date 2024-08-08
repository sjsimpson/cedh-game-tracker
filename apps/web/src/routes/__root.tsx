// import { Toaster } from "@cedh-game-tracker/ui";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { useAuth, type AuthContext } from "../auth";

export const Route = createRootRouteWithContext<{
  auth: AuthContext;
}>()({
  component: App,
});

function App() {
  const auth = useAuth();
  return (
    <>
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/new-user" className="[&.active]:font-bold">
          New User
        </Link>
        {auth.user && (
          <Link to="/my-games" className="[&.active]:font-bold">
            My Games
          </Link>
        )}
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
