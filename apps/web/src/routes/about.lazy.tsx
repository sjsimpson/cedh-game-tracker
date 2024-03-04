import { Button, Input } from "@cedh-game-tracker/ui";
import { useForm, type FieldApi } from "@tanstack/react-form";
import { createLazyFileRoute } from "@tanstack/react-router";

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

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      await createUser.mutateAsync(
        { name: value.name },
        {
          onSuccess: () => {
            users.refetch();
          },
        },
      );
    },
  });
  const createUser = trpc.createUser.useMutation();
  const users = trpc.getUsers.useQuery();
  return (
    <div className="p-2">
      Hello from About!
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div>
            {/* A type-safe field component*/}
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "A first name is required"
                    : value.length < 3
                      ? "First name must be at least 3 characters"
                      : undefined,
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  return (
                    value.includes("error") &&
                    'No "error" allowed in first name'
                  );
                },
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button variant="outline" type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </Button>
            )}
          />
        </form>
      </form.Provider>
      <div>
        {users.isSuccess &&
          users.data.map((user, index) => (
            <div key={user.id}>
              <div>User {index}</div>
              <div>name: {user.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
