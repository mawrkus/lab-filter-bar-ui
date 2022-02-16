import { Icon, Label } from 'semantic-ui-react'

export const Chiclet = ({ filter, onClick, onRemove }) => {
  const { attribute, operator, value, type } = filter;

  if (type === 'logical-operator') {
    return (
      <div>
        <Label
          as='a'
          color="blue"
          title="Click to edit"
          onClick={(e) => onClick(e, filter, 'logical-operator')}
        >
          {operator.label}
        </Label>
      </div>
    );
  }

  return (
    <div>
      <Label
        as='a'
        color="blue"
        onClick={(e) => onClick(e, filter, 'attribute')}
      >
        {attribute.label}
      </Label>

      <Label
        as='a'
        color="blue"
        title="Click to edit"
        onClick={(e) => onClick(e, filter, 'operator')}
      >
        {operator.label}
      </Label>

      <Label
        as='a'
        color="blue"
        title="Click to edit"
        onClick={(e) => onClick(e, filter, 'value')}
      >
        {value.label}
      </Label>

      <Label
        as='a'
        color="blue"
        title="Remove filter"
        onClick={(e) => onRemove(e, filter)}
      >
        <Icon name='delete' />
      </Label>
    </div>
  );
};
