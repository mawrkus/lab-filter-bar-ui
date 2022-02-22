import { Label } from 'semantic-ui-react'

export const ChicletLogicalOperator = ({ filter, onClick }) => {
  const { operator } = filter;

  return (
    <div className="chiclet">
      <Label
        as='a'
        color="blue"
        size="small"
        title={`Click to change "${operator.label}"`}
        className="operator"
        onClick={(e) => onClick(e, filter, 'logical-operator')}
        tabIndex="0"
      >
        {operator.label}
      </Label>
    </div>
  );
};
