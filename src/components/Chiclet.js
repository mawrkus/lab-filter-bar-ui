import { Icon, Label } from 'semantic-ui-react'

export const Chiclet = ({ filter, onClick, onRemove }) => {
  const { attribute, operator, value } = filter;

  return (
    <div>
      <Label
        as='a'
        onClick={(e) => onClick(e, filter, 'attribute')}
      >
        {attribute.label}
      </Label>

      <Label
        as='a'
        title="Click to edit"
        onClick={(e) => onClick(e, filter, 'operator')}
      >
        {operator.label}
      </Label>

      <Label
        as='a'
        title="Click to edit"
        onClick={(e) => onClick(e, filter, 'value')}
      >
        {value.label}
      </Label>

      <Label
        as='a'
        title="Remove filter"
        onClick={(e) => onRemove(e, filter)}
      >
        <Icon name='delete' />
      </Label>
    </div>
  );
};
