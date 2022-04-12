export const transitionLogger = (transition, ctx) => {
  console.log("📟", new Date().toLocaleString());
  console.log(" 📥 %s(%o)", transition.event.name, transition.event.data);

  if (transition.isValid) {
    console.log("  ✔ %s → %s", transition.fromStateId, transition.toStateId);
  } else {
    console.log("  💥 %s → %s", transition.fromStateId, transition.toStateId);
  }

  Object.entries(ctx.get()).forEach(([key, value]) => {
    console.log("    🔎 %s=%o", key, JSON.stringify(value));
  });
};
