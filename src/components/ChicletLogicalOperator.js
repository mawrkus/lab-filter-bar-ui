import { Label } from "semantic-ui-react";

export const ChicletLogicalOperator = ({ filter, onClick }) => {
  const { operator } = filter;

  return (
    <div className="chiclet logical-operator" id={`f-${filter.id}`}>
      <Label
        as="a"
        size="small"
        title={`Click to change "${operator.label}"`}
        className="operator"
        onClick={(e) => onClick(e, filter, "logical-operator")}
        tabIndex="0"
      >
        {operator.label}
      </Label>
    </div>
  );
};
