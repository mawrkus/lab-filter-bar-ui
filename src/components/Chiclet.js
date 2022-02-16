import { Icon, Label } from 'semantic-ui-react'

export const Chiclet = ({ filter, onClick, onRemove }) => {
  const { attribute, operator, value, type } = filter;

  if (type === 'logical-operator') {
    return (
      <div className="chiclet">
        <Label
          as='a'
          color="blue"
          size="small"
          title="Edit"
          onClick={(e) => onClick(e, filter, 'logical-operator')}
        >
          {operator.label}
        </Label>
      </div>
    );
  }

  return (
    <div className="chiclet">
      <Label
        as='span'
        color="blue"
        size="small"
        className="left"
      >
        {attribute.label}
      </Label>

      <Label
        as='a'
        color="blue"
        size="small"
        title="Edit"
        className="middle"
        onClick={(e) => onClick(e, filter, 'operator')}
      >
        {operator.label}
      </Label>

      <Label
        as='a'
        color="blue"
        size="small"
        title="Edit"
        className="middle"
        onClick={(e) => onClick(e, filter, 'value')}
      >
        {value.label}
      </Label>

      <Label
        as='a'
        color="blue"
        size="small"
        title="Remove"
        className="right"
        onClick={(e) => onRemove(e, filter)}
      >
        <Icon name='delete' />
      </Label>
    </div>
  );
};
