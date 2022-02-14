import { waitFor } from "./waitFor";

export const attributeService = {
  load: async () => {
    await waitFor(100);

    return [{
      id: 1,
      value: 'entityType',
      label: 'Entity type',
    }, {
      id: 2,
      value: 'environment',
      label: 'Environment',
    }, {
      id: 3,
      value: 'account',
      label: 'Account',
    }];
  },
};
