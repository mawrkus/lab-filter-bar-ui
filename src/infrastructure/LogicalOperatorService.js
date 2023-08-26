export class LogicalOperatorService {
  load({ addParens }) {
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

    if (addParens) {
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
