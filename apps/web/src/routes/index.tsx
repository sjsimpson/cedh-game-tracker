import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@cedh-game-tracker/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useAuth } from "../auth";
import { LoginForm } from "../components/login-form";

const homeSearchSchema = z.object({
  login: z.boolean().optional(),
  redirect: z.string().optional(),
});

type HomeSearch = z.infer<typeof homeSearchSchema>;

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search: Record<string, unknown>): HomeSearch =>
    homeSearchSchema.parse(search),
});

function Index() {
  // NOTE: Ran into issue using "getRouteApi" and "searchParams" typing might be worth a bug report
  const routeSearch = Route.useSearch();
  const navigate = useNavigate();
  const auth = useAuth();

  const [localOpen, setLocalOpen] = useState(false);

  useEffect(() => {
    setLocalOpen(routeSearch.login || false);
  }, [routeSearch]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setLocalOpen(false);
      navigate({ to: routeSearch.redirect ?? "/" });
    }
  }, [auth.isAuthenticated]);

  const handleCloseModal = () => {
    setLocalOpen(false);
    navigate({ search: () => ({}) }); // NOTE: Kinda janky, but gets rid of weird refresh issues
  };

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Dialog open={localOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setLocalOpen(!localOpen)}>Open Login</Button>
        </DialogTrigger>
        <DialogContent handleClose={handleCloseModal} className="bg-white">
          <LoginForm />
        </DialogContent>
      </Dialog>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
}
