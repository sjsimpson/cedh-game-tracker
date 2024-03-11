import { createFileRoute } from "@tanstack/react-router";

import { Login } from "../components/login";

type HomeSearch = {
  login?: true;
  redirect?: string;
};

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    return {
      login: search.login === true ? true : undefined,
      redirect: search?.redirect as string,
    };
  },
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Login />
    </div>
  );
}
