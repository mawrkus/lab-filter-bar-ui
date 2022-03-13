export class OperatorService {
  load() {
    return [
      {
        id: 1,
        value: "=",
        label: "=",
        type: "single-value",
      },
      {
        id: 2,
        value: "!=",
        label: "!=",
        type: "single-value",
      },
      {
        id: 3,
        value: "like",
        label: "LIKE",
        type: "single-value",
      },
      {
        id: 4,
        value: "not-like",
        label: "NOT LIKE",
        type: "single-value",
      },
      {
        id: 5,
        value: "is-null",
        label: "IS NULL",
        type: "preset-value",
        presetValue: null,
      },
      {
        id: 6,
        value: "is-not-null",
        label: "IS NOT NULL",
        type: "preset-value",
        presetValue: null,
      },
      {
        id: 7,
        value: "in",
        label: "IN",
        type: "multiple-value",
      },
      {
        id: 8,
        value: "not-in",
        label: "NOT IN",
        type: "multiple-value",
      },
    ];
  }
}
