export const service = {
  loadAttributes: async () => [{
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
  }],
  loadOperators: async () => [{
    id: 1,
    value: '=',
    label: '=',
  }, {
    id: 2,
    value: '!=',
    label: '!=',
  }],
  loadValues: async ({ type }) => {
    if (type === 'entityType') {
      return [{
        id: 1,
        value: 'EXT-SYNTH',
        label: 'Synthetics',
      }, {
        id: 2,
        value: 'APP-DASHBOARD',
        label: 'Dashboards',
      }, {
        id: 3,
        value: 'APM-BROWSER',
        label: 'Browsers',
      }];
    }

    if (type === 'environment') {
      return [{
        id: 1,
        value: 'staging',
        label: 'Staging',
      }, {
        id: 2,
        value: 'production',
        label: 'Production',
      }];
    }

    if (type === 'account') {
      return [{
        id: 1,
        value: 'mawrkus',
        label: 'Mawrkus',
      }, {
        id: 2,
        value: 'mario',
        label: 'Mario',
      }];
    }
  },
};
