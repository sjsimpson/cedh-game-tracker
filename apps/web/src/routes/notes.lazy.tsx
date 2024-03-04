import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/notes")({
  component: Notes,
});

function Notes() {
  return (
    <div className="p-2">
      <h3>Things we need to track a game:</h3>
      <ul>
        <li>date</li>
        <li>venue</li>
        <li>players</li>
        <ul>
          <li>deck</li>
          <li>me</li>
          <li>winner</li>
          <li>no winner chosen... draw (prompt on save)</li>
        </ul>
        <li>opening hand & mulligan</li>
        <ul>
          <li>Best cards?</li>
          <li># cards kept</li>
          <li>full opening hand</li>
        </ul>
        <li>win condition</li>
        <ul>
          <li>combo pieces</li>
          <li>key cards</li>
          <li>win condition?</li>
        </ul>
        <li>is tournament</li>
      </ul>
      <div>authentication flows and data</div>
    </div>
  );
}
