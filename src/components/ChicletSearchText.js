import { Icon, Label } from 'semantic-ui-react'

export const ChicletSearchText = ({ filter, onClick, onRemove }) => {
  const { value } = filter;

  return (
    <div className="chiclet search-text">
      <Label
        as='a'
        color="blue"
        size="small"
        title={`Click to change "${value.label}"`}
        className="left value"
        onClick={(e) => onClick(e, filter, 'value')}
        tabIndex="0"
      >
        "{value.label}"
      </Label>

      <Label
        as='a'
        color="blue"
        size="small"
        title={`Click to remove "${value.label}"`}
        className="right"
        onClick={(e) => onRemove(e, filter)}
        tabIndex="0"
      >
        <Icon name='delete' />
      </Label>
    </div>
  );
};
