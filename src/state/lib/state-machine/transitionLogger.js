export const transitionLogger = (transition, ctx) => {
  console.log("📟", new Date());
  console.log("  📥 %s(%o)", transition.event.name, transition.event.data);

  if (transition.isValid) {
    console.log("  ✔ %s → %s", transition.fromStateId, transition.toStateId);
  } else {
    console.log("  💥 %s → %s", transition.fromStateId, transition.toStateId);
  }

  console.log("  🔎", JSON.stringify(ctx.get()));
};
