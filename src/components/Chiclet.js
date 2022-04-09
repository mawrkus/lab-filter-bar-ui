import { memo } from "react";
import areEqual from "fast-deep-equal";

import { ChicletAttributeOperator } from "./ChicletAttributeOperator";
import { ChicletAttributeOperatorValue } from "./ChicletAttributeOperatorValue";
import { ChicletLogicalOperator } from "./ChicletLogicalOperator";
import { ChicletSearchText } from "./ChicletSearchText";
import { ParensGroup } from "./ParensGroup";
import { PartialChiclet } from "./PartialChiclet";

const ChicletComponent = ({ filter, onClick, onRemove }) => {
  switch (filter.type) {
    case "parens":
      return (
        <ParensGroup filter={filter} onClick={onClick} onRemove={onRemove} />
      );

    case "partial":
      return <PartialChiclet filter={filter} onClick={onClick} />;

    case "attribute-operator-value":
      return (
        <ChicletAttributeOperatorValue
          filter={filter}
          onClick={onClick}
          onRemove={onRemove}
        />
      );

    case "attribute-operator":
      return (
        <ChicletAttributeOperator
          filter={filter}
          onClick={onClick}
          onRemove={onRemove}
        />
      );

    case "logical-operator":
      return <ChicletLogicalOperator filter={filter} onClick={onClick} />;

    case "search-text":
      return (
        <ChicletSearchText
          filter={filter}
          onClick={onClick}
          onRemove={onRemove}
        />
      );

    default:
      throw new TypeError(
        `Unsupported filter type "${filter.type}" (${JSON.stringify(filter)})!`
      );
  }
};

export const Chiclet = memo(ChicletComponent, (prevProps, nextProps) => {
  // prevents stale partial chiclet when e.g.:
  // removing a partial operator with backspace and selecting a new one
  // this happens because 2 successive setProps() are batched in useStateMachine()
  // resulting in a single render with the same prev/next props here
  if (nextProps.filter.type === "partial") {
    return false;
  }

  return areEqual(prevProps, nextProps);
});
