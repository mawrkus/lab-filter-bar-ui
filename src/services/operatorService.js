import { waitFor } from "./waitFor";

export const operatorService = {
  load: async () => {
    await waitFor(250);

    return [{
      id: 1,
      value: '=',
      label: '=',
    }, {
      id: 2,
      value: '!=',
      label: '!=',
    }, {
      id: 3,
      value: 'LIKE',
      label: 'LIKE',
    }, {
      id: 4,
      value: 'NOT_LIKE',
      label: 'NOT LIKE',
    }];
  }
};
