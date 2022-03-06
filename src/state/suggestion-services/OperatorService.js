export class OperatorService {
  load() {
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
    }, {
      id: 5,
      value: 'is-null',
      label: 'IS NULL',
      presetValue: null,
    }, {
      id: 6,
      value: 'is-not-null',
      label: 'IS NOT NULL',
      presetValue: null,
    }, {
      id: 7,
      value: 'in',
      label: 'IN',
      selectionType: 'multiple',
    }, {
      id: 8,
      value: 'not-in',
      label: 'NOT IN',
      selectionType: 'multiple',
    }];
  }
};
