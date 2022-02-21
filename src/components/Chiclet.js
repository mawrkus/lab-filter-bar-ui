import { ChicletAttributeOperatorValue } from './ChicletAttributeOperatorValue';
import { ChicletLogicalOperator } from './ChicletLogicalOperator';
import { ChicletValue } from './ChicletValue';

export const Chiclet = ({
  filter,
  onClick,
  onRemove,
}) => {
  const { attribute, operator, value } = filter;

  if (attribute && operator && value) {
    return <ChicletAttributeOperatorValue filter={filter} onClick={onClick} onRemove={onRemove} />
  }

  if (operator) {
    return <ChicletLogicalOperator filter={filter} onClick={onClick} onRemove={onRemove} />
  }

  if (value) {
    return <ChicletValue filter={filter} onClick={onClick} onRemove={onRemove} />
  }

  throw new TypeError(`Unsupported filter (${JSON.stringify(filter)})!`);
};
