import "@cedh-game-tracker/tailwind/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { httpLink } from "@trpc/client";
import { StrictMode, useState } from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "./auth";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { trpc } from "./utils/trpc";

// Configs
// FIX: this is currently not importing correctly in dev
// but the defaults are fine for dev, and it might be okay in prod
const API_HOST = import.meta.env.API_HOST || "http://localhost";
const API_PORT = import.meta.env.API_PORT
  ? parseInt(import.meta.env.API_PORT)
  : 5000;
const TRPC_PREFIX = import.meta.env.TRPC_PREFIX || "/trpc";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Create root app
export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: `${API_HOST}:${API_PORT}${TRPC_PREFIX}`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
