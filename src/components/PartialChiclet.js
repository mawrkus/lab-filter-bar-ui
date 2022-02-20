import { Label } from 'semantic-ui-react'

export const PartialChiclet = ({ filter, onClick }) => {
  const { attribute, operator } = filter;

  return (
    <div className="partial-chiclet">
      {attribute && <Label
        as='a'
        size="small"
        title={`Click to change "${attribute.label}"`}
        className="left attribute"
        onClick={(e) => onClick(e, filter, 'attribute')}
      >
        {attribute.label}
      </Label>}

      {operator && <Label
        as='a'
        size="small"
        title={`Click to change "${operator.label}"`}
        className="middle operator"
        onClick={(e) => onClick(e, filter, 'operator')}
      >
        {operator.label}
      </Label>}
    </div>
  );
};
