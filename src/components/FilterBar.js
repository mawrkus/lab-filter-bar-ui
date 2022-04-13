import { memo, useCallback } from "react";

import { Chiclet } from "./Chiclet";
import { SuggestionsDropdown } from "./suggestions/SuggestionsDropdown";
import {
  useKeyboardActions,
  useDropdownPosition,
  useStateMachine,
} from "../hooks";

const FilterBarComponent = ({ stateMachine }) => {
  const [props] = useStateMachine(stateMachine);

  useDropdownPosition(
    props.suggestions.visible,
    props.edition,
    props.insertion
  );

  useKeyboardActions();

  const onClickChiclet = useCallback(
    (event, filter, part) => {
      stateMachine.sendEvent("editFilter", { filter, part });
    },
    [stateMachine]
  );

  const onRemoveChiclet = useCallback(
    (event, filter) => {
      stateMachine.sendEvent("removeFilter", { filter });
    },
    [stateMachine]
  );

  const onOpenSuggestionsDropdown = () => {
    stateMachine.sendEvent("startInput");
  };

  const onCloseSuggestionsDropdown = () => {
    stateMachine.sendEvent("discardSuggestions");
  };

  const onSelectSuggestionItem = (event, item, isSearchText = false) => {
    stateMachine.sendEvent("selectItem", { item, isSearchText });
  };

  const onBackspace = () => {
    stateMachine.sendEvent("removeLastFilter");
  };

  return (
    <div className="filter-bar">
      <div className="chiclets">
        {props.filters.map((filter) => (
          <Chiclet
            key={filter.id}
            filter={filter}
            onClick={onClickChiclet}
            onRemove={onRemoveChiclet}
          />
        ))}
      </div>

      <div className="suggestions">
        <SuggestionsDropdown
          multiple={props.suggestions.selectionType === "multiple"}
          selectedItem={props.edition?.filter?.[props.edition?.part]}
          open={props.suggestions.visible}
          loading={props.suggestions.loading}
          error={props.suggestions.error}
          suggestions={props.suggestions.items}
          onOpen={onOpenSuggestionsDropdown}
          onClose={onCloseSuggestionsDropdown}
          onSelectItem={onSelectSuggestionItem}
          onBackspace={onBackspace}
        />
      </div>
    </div>
  );
};

export const FilterBar = memo(FilterBarComponent);
