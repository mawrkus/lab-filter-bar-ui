import { Icon, Label } from 'semantic-ui-react'

export const ChicletAttributeOperatorValue = ({ filter, onClick, onRemove }) => {
  const { attribute, operator, value } = filter;

  return (
    <div className="chiclet">
      <Label
        as='span'
        color="blue"
        size="small"
        title={`Cannot change "${attribute.label}"`}
        className="left attribute"
      >
        {attribute.label}
      </Label>

      <Label
        as='a'
        color="blue"
        size="small"
        title={`Click to change "${operator.label}"`}
        className="middle operator"
        onClick={(e) => onClick(e, filter, 'operator')}
        tabIndex="0"
      >
        {operator.label}
      </Label>

      <Label
        as='a'
        color="blue"
        size="small"
        title={`Click to change "${value.label}"`}
        className="middle value"
        onClick={(e) => onClick(e, filter, 'value')}
        tabIndex="0"
      >
        {value.id ? value.label : `"${value.label}"`}
      </Label>

      <Label
        as='a'
        color="blue"
        size="small"
        title={`Click to remove "${attribute.label} ${operator.label} ${value.label}"`}
        className="right"
        onClick={(e) => onRemove(e, filter)}
        tabIndex="0"
      >
        <Icon name='delete' />
      </Label>
    </div>
  );
};
