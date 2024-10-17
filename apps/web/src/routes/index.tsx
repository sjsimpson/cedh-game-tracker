import { Button } from "@cedh-game-tracker/ui/components/button";
import { Dialog } from "@cedh-game-tracker/ui/components/dialog";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useAuth } from "../auth";
import { LoginForm } from "../components/login-form";

const HomeSearchSchema = z.object({
  login: z.boolean().optional(),
  redirect: z.string().optional(),
});

type HomeSearch = z.infer<typeof HomeSearchSchema>;

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search: Record<string, unknown>): HomeSearch =>
    HomeSearchSchema.parse(search),
});

function Index() {
  // NOTE: Ran into issue using "getRouteApi" and "searchParams" typing; might be worth a bug report
  const routeSearch = Route.useSearch();
  const navigate = useNavigate();
  const auth = useAuth();
  // const { toast } = useToast();

  const [localOpen, setLocalOpen] = useState(false);

  useEffect(() => {
    setLocalOpen(routeSearch.login || false);
  }, [routeSearch]);

  const handleCloseModal = () => {
    setLocalOpen(false);
    navigate({ search: () => ({}) }); // NOTE: Kinda janky, but gets rid of weird refresh issues
  };

  // TODO: change logout button to actually sign user out
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button onClick={() => setLocalOpen(!localOpen)}>Open Login</Button>
      <Dialog open={localOpen} onClose={handleCloseModal}>
        <LoginForm
          onSuccessfulLogin={() => {
            routeSearch.redirect
              ? navigate({ to: routeSearch.redirect })
              : handleCloseModal();
          }}
        />
      </Dialog>
      <Button
        onClick={() => {
          auth.setUser(null);
          // toast({ title: "Logged out successfully" });
        }}
      >
        Logout
      </Button>
    </div>
  );
}
