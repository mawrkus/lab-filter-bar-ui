export const logicalOperatorService = {
  load: async () => {
    return [{
      id: 1,
      value: 'and',
      label: 'AND',
    }, {
      id: 2,
      value: 'or',
      label: 'OR',
    }];
  }
};
