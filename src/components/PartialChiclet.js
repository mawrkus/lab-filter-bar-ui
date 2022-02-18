import { Label } from 'semantic-ui-react'

export const PartialChiclet = ({ filter, onClick }) => {
  const { attribute, operator } = filter;

  if (operator) {
    return (
      <div className="partial-chiclet">
        <Label
          as='a'
          size="small"
          title="Change attribute"
          className="left"
          onClick={(e) => onClick(e, filter, 'attribute')}
        >
          {attribute.label}
        </Label>

        <Label
          as='a'
          size="small"
          title="Change operator"
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
          onClick={(e) => onClick(e, filter, 'attribute')}
        >
          {attribute.label}
        </Label>
      </div>
    );
  }

  return null;
};
