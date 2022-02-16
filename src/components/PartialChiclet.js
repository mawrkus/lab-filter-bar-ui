import { Label } from 'semantic-ui-react'

export const PartialChiclet = ({ filter, onClick }) => {
  const { attribute, operator } = filter;

  if (operator) {
    return (
      <div className="partial-chiclet">
        <Label
          as='a'
          size="small"
          className="left"
        >
          {attribute.label}
        </Label>

        <Label
          as='a'
          size="small"
          title="Click to edit"
          className="middle"
          onClick={(e) => onClick(e, filter, 'operator')}
        >
          {operator.label}
        </Label>
      </div>
    );
  }

  if (attribute) {
    return (
      <div className="partial-chiclet">
        <Label
          as='a'
          size="small"
          className="left"
        >
          {attribute.label}
        </Label>
      </div>
    );
  }

  return null;
};
