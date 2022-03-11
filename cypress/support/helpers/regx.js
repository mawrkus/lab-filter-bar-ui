// eslint-disable-next-line no-useless-escape
export const regx = (s) => new RegExp(`^${s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`);
