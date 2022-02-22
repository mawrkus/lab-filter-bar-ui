import { ChicletAttributeOperatorValue } from './ChicletAttributeOperatorValue';
import { ChicletLogicalOperator } from './ChicletLogicalOperator';
import { ChicletSearchText } from './ChicletSearchText';

export const Chiclet = ({ filter, onClick, onRemove }) => {
  switch (filter.type) {
    case 'attribute-operator-value':
      return <ChicletAttributeOperatorValue filter={filter} onClick={onClick} onRemove={onRemove} />

    case 'logical-operator':
      return <ChicletLogicalOperator filter={filter} onClick={onClick} onRemove={onRemove} />

    case 'search-text':
      return <ChicletSearchText filter={filter} onClick={onClick} onRemove={onRemove} />

    default:
      throw new TypeError(`Unsupported filter type "${filter.type}" (${JSON.stringify(filter)})!`);
  }
};
