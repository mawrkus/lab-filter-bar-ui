import { useEffect, useState } from "react";

export const useFiltersFromUrl = () => {
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const parsedUrl = new URL(window.location.href);
    const jsonFilters = parsedUrl.searchParams.get("filters");
    const urlFilters = JSON.parse(jsonFilters);
    const initFilters = Array.isArray(urlFilters) ? urlFilters : [];

    if (initFilters.length) {
      setFilters(initFilters);
    }
  }, [setFilters]);

  // TOOD: set -> change URL search param?
  return [filters];
};
