import { Icon, Label } from 'semantic-ui-react'

export const ChicletSearchText = ({
  filter,
  onClick,
  onRemove,
}) => {
  const { value } = filter;

  return (
    <div className="chiclet">
      <Label
        as='a'
        color="blue"
        size="small"
        title={`Click to change "${value.label}"`}
        className="left value"
        onClick={(e) => onClick(e, filter, 'value')}
      >
        "{value.label}"
      </Label>

      <Label
        as='a'
        color="blue"
        size="small"
        title="Remove filter"
        className="right"
        onClick={(e) => onRemove(e, filter)}
      >
        <Icon name='delete' />
      </Label>
    </div>
  );
};
