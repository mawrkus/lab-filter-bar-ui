import { Label } from "semantic-ui-react";
import { Chiclet } from "./chiclets/Chiclet";

export const ParensGroup = ({ filter, onClick, onRemove }) => {
  return (
    <div className="chiclet parens" id={filter.id}>
      <Label size="medium" className="paren" tabIndex="0">
        (
      </Label>
      {filter.filters.map((filter) => (
        <Chiclet
          key={filter.id}
          filter={filter}
          onClick={onClick}
          onRemove={onRemove}
        />
      ))}
      <Label
        as="a"
        size="small"
        className="add-filter"
        title="Click to add a filter to this parentheses group"
        onClick={(e) => onClick(e, filter, "add-filter")}
        tabIndex="0"
      >
        ...
      </Label>
      <Label size="medium" className="paren" tabIndex="0">
        )
      </Label>
    </div>
  );
};
