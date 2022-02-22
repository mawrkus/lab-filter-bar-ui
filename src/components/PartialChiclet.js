import { memo } from 'react';
import areEqual from 'fast-deep-equal';
import { Label } from 'semantic-ui-react'

const PartialChicletComponent = ({ filter, onClick }) => {
  const { attribute, operator } = filter;

  return (
    <div className="partial-chiclet">
      {attribute && <Label
        as='a'
        size="small"
        title={`Click to change "${attribute.label}"`}
        className="left attribute"
        onClick={(e) => onClick(e, filter, 'attribute')}
        tabIndex="0"
      >
        {attribute.label}
      </Label>}

      {operator && <Label
        as='a'
        size="small"
        title={`Click to change "${operator.label}"`}
        className="middle operator"
        onClick={(e) => onClick(e, filter, 'operator')}
        tabIndex="0"
      >
        {operator.label}
      </Label>}
    </div>
  );
};

export const PartialChiclet = memo(PartialChicletComponent, areEqual);
