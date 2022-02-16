export const operatorService = {
  load: async () => {
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
      value: 'like',
      label: 'LIKE',
    }, {
      id: 4,
      value: 'not-like',
      label: 'NOT LIKE',
    }];
  }
};
