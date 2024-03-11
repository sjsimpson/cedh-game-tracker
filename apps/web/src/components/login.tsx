import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@cedh-game-tracker/ui";
import { useForm, type FieldApi } from "@tanstack/react-form";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useAuth } from "../auth";
import { trpc } from "../utils/trpc";

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em>{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const routeApi = getRouteApi("/");

export function Login() {
  const routeSearch = routeApi.useSearch();

  const [localOpen, setLocalOpen] = useState(false);

  useEffect(() => {
    setLocalOpen(routeSearch.login || false);
  }, [routeSearch.login]);

  const handleCloseModal = () => {
    setLocalOpen(false);
  };

  return (
    <Dialog open={localOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setLocalOpen(!localOpen)}>Open Login</Button>
      </DialogTrigger>
      <DialogContent handleClose={handleCloseModal} className="bg-white">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <LoginForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function LoginForm() {
  const { saveUser } = useAuth();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await login.mutateAsync(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: (data) => {
            saveUser(data);
          },
        },
      );
    },
  });

  const login = trpc.auth.login.useMutation();

  return (
    <form.Provider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4 bg-white">
          {/* A type-safe field component*/}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Email is required"
                  : value.length < 3
                    ? "Email must be at least 3 characters"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") && 'No "error" allowed in first name'
                );
              },
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <div>
                  <Label>Email Address</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          />
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Password is required"
                  : value.length < 3
                    ? "First name must be at least 3 characters"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") && 'No "error" allowed in first name'
                );
              },
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <div>
                  <Label>Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          />
          <DialogFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button variant="outline" type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Submit"}
                </Button>
              )}
            />
          </DialogFooter>
        </div>
      </form>
    </form.Provider>
  );
}
