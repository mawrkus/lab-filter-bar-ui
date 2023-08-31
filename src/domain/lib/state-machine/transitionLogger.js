export const transitionLogger = (transition, ctx) => {
  console.log("📟", new Date().toLocaleString());

  if (transition.isValid) {
    console.log(
      "  📥 %s → %s(%o) → %s",
      transition.fromStateId,
      transition.event.name,
      transition.event.data,
      transition.toStateId
    );
  } else {
    console.log(
      "  💥 %s → %s(%o) → %s",
      transition.fromStateId,
      transition.event.name,
      transition.event.data,
      transition.fromStateId
    );
  }

  Object.entries(ctx.get()).forEach(([key, value]) => {
    console.log("    🔎 %s=%o", key, value ? JSON.stringify(value) : value);
  });
};
