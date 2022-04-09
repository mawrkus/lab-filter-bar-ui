export class LogicalOperatorService {
  load({ parens }) {
    const items = [
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

    if (parens) {
      items.push({
        id: 3,
        value: "parens",
        label: "( ... )",
        type: "parens",
      });
    }

    return items;
  }
}
