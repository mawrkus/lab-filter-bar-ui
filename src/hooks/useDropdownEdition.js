import { useEffect } from "react";

const getDropdownPosition = (chicletElement, filter) => {
  const { top, bottom, left } = chicletElement.getBoundingClientRect();
  let leftDec = 31;

  if (filter.type === "search-text") {
    leftDec = 22;
  } else if (filter.value?.id?.length) { // multi values
    leftDec = 26;
  }

  return { top: bottom - top, left: left - leftDec };
};

export const useDropdownEdition = (open, edition) => {
  useEffect(() => {
    const dropdownElement = document.querySelector(".ui.search.dropdown");

    if (!edition) {
      dropdownElement.style.position = null;
      dropdownElement.style.top = null;
      dropdownElement.style.left = null;
      return;
    }

    if (open && edition) {
      // see <Chiclet /> & <PartialChiclet />
      const chicletElement = document.querySelector(`#f-${edition.filter.id} .${edition.part}`);
      const position = getDropdownPosition(chicletElement, edition.filter);

      dropdownElement.style.position = "absolute";
      dropdownElement.style.top = `${position.top}px`;
      dropdownElement.style.left = `${position.left}px`;
    }

    if (open) {
      // force a click to work when a chiclet is removed and a partial filter exists
      dropdownElement.querySelector("input.search").click();
    }
  }, [open, edition]);

  return [edition?.filter?.[edition?.part]];
};
