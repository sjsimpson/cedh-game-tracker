// import { Toaster } from "@cedh-game-tracker/ui";
import { Navbar, NavbarItem } from "@cedh-game-tracker/ui/components/navbar";
import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
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
  const location = useLocation();

  console.log("location", location);

  return (
    <>
      <Navbar>
        <NavbarItem to="/" current={location.pathname === "/"}>
          Home
        </NavbarItem>
        <NavbarItem to="/new-user" current={location.pathname === "/new-user"}>
          New User
        </NavbarItem>
        {auth.user && (
          <NavbarItem to="/my-games" current={location.pathname === "my-games"}>
            My Games
          </NavbarItem>
        )}
      </Navbar>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
