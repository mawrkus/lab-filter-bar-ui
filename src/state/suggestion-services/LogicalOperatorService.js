export class LogicalOperatorService {
  load() {
    return [
      {
        id: 1,
        value: "and",
        label: "AND",
        type: "logical",
      },
      {
        id: 2,
        value: "or",
        label: "OR",
        type: "logical",
      },
    ];
  }
}
