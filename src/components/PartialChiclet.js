import { Label } from 'semantic-ui-react'

export const PartialChiclet = ({ filter }) => {
  const { attribute, operator } = filter;

  return (
    <div>
      {attribute && <Label as='a'>
        {attribute.label}
      </Label>}
      {operator && <Label as='a'>
        {operator.label}
      </Label>}
    </div>
  );
};
