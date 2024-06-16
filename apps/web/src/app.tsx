import "@cedh-game-tracker/tailwind/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { httpLink } from "@trpc/client";
import { StrictMode, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider, useAuth } from "./auth";
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

// Create clients
const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
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
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Create root app
export function AppInner() {
  const auth = useAuth();

  const validateQuery = trpc.auth.validate.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    // NOTE: refetch validation query on authenticated path navigate?
    // it's probably better to just revalidate on EACH page navigate
    // --> currently validate on all pages EXCEPT home, because that's where
    // we reroute when authentication is missing
    const unsubscribe = router.subscribe(
      "onBeforeLoad",
      ({ toLocation, pathChanged }) =>
        pathChanged && toLocation.pathname !== "/" && validateQuery.refetch(),
    );

    return () => unsubscribe();
  }, []);

  // NOTE: Logout if validationQuery fails and we have a current user (means session is expired)
  useEffect(() => {
    if (validateQuery.isError && auth.user) {
      auth.logout();
    }
  }, [validateQuery.isError]);

  // NOTE: Invalidate router when authentication status changes, retriggering beforeLoad/loader functions
  useEffect(() => {
    router.invalidate();
  }, [auth.isAuthenticated]);

  return <RouterProvider router={router} context={{ auth }} />;
}

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AppInner />
          </Suspense>
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
