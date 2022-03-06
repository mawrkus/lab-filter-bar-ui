import { SuggestionsDropdownMulti } from "./SuggestionsDropdownMulti";
import { SuggestionsDropdownSingle } from "./SuggestionsDropdownSingle";

export const SuggestionsDropdown = ({ multiple, ...props }) =>
  multiple ? (
    <SuggestionsDropdownMulti {...props} />
  ) : (
    <SuggestionsDropdownSingle {...props} />
  );
