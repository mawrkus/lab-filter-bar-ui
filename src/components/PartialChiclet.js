import { Label } from "semantic-ui-react";

export const PartialChiclet = ({ filter, onClick }) => {
  const { attribute, operator } = filter;

  if (!attribute && !operator) {
    return null;
  }

  return (
    <div className="chiclet partial" id={filter.id}>
      {attribute && (
        <Label
          as="a"
          size="small"
          title={`Click to change "${attribute.label}"`}
          className="left attribute"
          onClick={(e) => onClick(e, filter, "attribute")}
          tabIndex="0"
        >
          {attribute.label}
        </Label>
      )}

      {operator && (
        <Label
          as="a"
          size="small"
          title={`Click to change "${operator.label}"`}
          className="middle operator"
          onClick={(e) => onClick(e, filter, "operator")}
          tabIndex="0"
        >
          {operator.label}
        </Label>
      )}
    </div>
  );
};
