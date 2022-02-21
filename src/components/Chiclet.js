import { ChicletAttributeOperatorValue } from './ChicletAttributeOperatorValue';
import { ChicletLogicalOperator } from './ChicletLogicalOperator';
import { ChicletValue } from './ChicletValue';

export const Chiclet = ({
  filter,
  onClick,
  onRemove,
}) => {
  const { attribute, operator, value } = filter;

  if (typeof attribute !== 'undefined' && typeof operator !== 'undefined' && typeof value !== 'undefined') {
    return <ChicletAttributeOperatorValue filter={filter} onClick={onClick} onRemove={onRemove} />
  }

  if (typeof operator !== 'undefined') {
    return <ChicletLogicalOperator filter={filter} onClick={onClick} onRemove={onRemove} />
  }

  if (typeof value !== 'undefined') {
    return <ChicletValue filter={filter} onClick={onClick} onRemove={onRemove} />
  }

  throw new TypeError(`Unsupported filter (${JSON.stringify(filter)})!`);
};
