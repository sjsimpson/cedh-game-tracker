import type { AppRouter } from "@cedh-game-tracker/api/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpLink } from "@trpc/react-query";
import { ReactNode, useState } from "react";

import { API_HOST, API_PORT, TRPC_PREFIX } from "./configs";

export const trpc = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: ReactNode }) {
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
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}
