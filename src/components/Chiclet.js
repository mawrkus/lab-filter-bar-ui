import { Icon, Label } from 'semantic-ui-react'

export const Chiclet = ({ filter, onRemove }) => {
  const { attribute, operator, operand } = filter;

  return (
    <div>
      <Label as='a'>
        {attribute.label}
      </Label>
      <Label as='a'>
        {operator.label}
      </Label>
      <Label as='a'>
        {operand.label}
      </Label>
      <Label as='a' onClick={(e) => onRemove(e, filter)}>
        <Icon name='delete' />
      </Label>
    </div>
  );
};
