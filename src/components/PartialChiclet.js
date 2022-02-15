import { Label } from 'semantic-ui-react'

export const PartialChiclet = ({ filter, onClick }) => {
  const { attribute, operator } = filter;

  return (
    <div>
      {attribute && <Label as='a'>
        {attribute.label}
      </Label>}
      {operator && <Label as='a' title="Click to edit" onClick={(e) => onClick(e, filter, 'operator')}>
        {operator.label}
      </Label>}
    </div>
  );
};
