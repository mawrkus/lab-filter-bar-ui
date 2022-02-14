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
  loadValues: async () => [{
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
  }],
};
