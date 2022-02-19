export const transitionLogger = (transition, ctx) => {
  console.log('📟', new Date());

  if (transition.event) {
    console.log('  📥 %s(%o)', transition.event?.name, transition.event?.data);
  }

  console.log('  %s %s → %s', transition.isValid
    ? '✔'
    : '💥', transition.fromStateId, transition.toStateId);

  console.log('  🔎', JSON.stringify(ctx.get()));
};
