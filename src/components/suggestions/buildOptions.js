const loadingOptions = [
  { key: 'loading', text: 'Loading...', value: 'loading' },
];

export const buildOptionValue = (item) => item ? `${item.id}-${item.value}` : '';

export const buildOptions = (loading, suggestions) =>
  loading
    ? loadingOptions
    : suggestions.map((item) => ({
        key: item.id,
        text: item.label,
        // 1. we do this to ensure a unique value because when onChange is called, the only property
        // received is value
        // 2. Using id here creates a UI bug where selecting with the keyboard then pressing enter
        // does not work when the 2nd dropdown is opened
        value: buildOptionValue(item),
      }));
