import { Button } from "@cedh-game-tracker/ui/components/button";
import {
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@cedh-game-tracker/ui/components/dialog";
import { Input } from "@cedh-game-tracker/ui/components/input";
import { useForm, type FieldApi } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useEffect } from "react";
import { z } from "zod";

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

export function LoginForm({
  onSuccessfulLogin,
}: {
  onSuccessfulLogin: () => void;
}) {
  const auth = useAuth();
  // const { toast } = useToast();

  const login = trpc.auth.signIn.useMutation();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: ({ value }) =>
      login.mutate(value, {
        onSuccess: (data) => {
          // toast({ title: "Logged in succesfully" });
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
        <DialogTitle>Login</DialogTitle>
        <DialogBody>
          <div className="flex flex-col gap-4 bg-white">
            <form.Field
              name="email"
              validators={{
                onBlur: z.string().email(),
              }}
              children={(field) => {
                // const error = field.state.meta.touchedErrors.length > 0;
                return (
                  <div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      // error={error}
                    />
                    <FieldInfo field={field} />
                  </div>
                );
              }}
            />
            <form.Field
              name="password"
              validators={{
                onChange: z.string().min(1),
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <div>
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
        </DialogBody>
        <DialogActions>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </Button>
            )}
          />
        </DialogActions>
      </form>
    </form.Provider>
  );
}
