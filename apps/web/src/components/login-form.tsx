import {
  Button,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@cedh-game-tracker/ui";
import { useForm, type FieldApi } from "@tanstack/react-form";
import { useEffect } from "react";

import { useAuth } from "../auth";
import { trpc } from "../trpc/react";

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

// TODO: Refactor extraction with "DialogHeader" and "DialogFooter",
// it feels weird in this context
export function LoginForm({
  onSuccessfulLogin,
}: {
  onSuccessfulLogin: () => void;
}) {
  const auth = useAuth();

  const login = trpc.auth.login.useMutation();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ value }) =>
      login.mutate(value, {
        onSuccess: (data) => {
          auth.setUser(data);
        },
      }),
  });

  useEffect(() => {
    if (auth.user) onSuccessfulLogin();
  }, [auth.user]);

  return (
    <form.Provider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4 bg-white"
      >
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        {/* A type-safe field component*/}
        <div className="flex flex-col gap-4 bg-white">
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
                    ? "Password must be at least 3 characters"
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
        </div>
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
      </form>
    </form.Provider>
  );
}
