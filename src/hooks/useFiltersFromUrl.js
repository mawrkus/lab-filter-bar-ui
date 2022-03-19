import { useState } from "react";

export const parseUrlFilters = () => {
  const parsedUrl = new URL(window.location.href);
  const jsonFilters = parsedUrl.searchParams.get("filters");
  const urlFilters = JSON.parse(jsonFilters);
  const parsedFilters = Array.isArray(urlFilters) ? urlFilters : [];

  // as the last filter index will be used to build the future filter ids
  // and the filter parsed from the URLs might have higher ids
  // (happens when some were deleted then more were created)
  // we ensure to remap them
  // TODO: use unique ids
  return parsedFilters.map((filter, i) => ({ ...filter, id: `f${i + 1}` }));
};

export const useFiltersFromUrl = () => {
  const [filters, setFilters] = useState(parseUrlFilters());

  const setUrlFilters = (newFilters) => {
    const url = new URL(window.location);

    if (newFilters.length) {
      url.searchParams.set("filters", JSON.stringify(newFilters));
    } else {
      url.searchParams.delete("filters");
    }

    window.history.pushState({}, "", url);

    setFilters(newFilters);
  };

  return [filters, setUrlFilters];
};
