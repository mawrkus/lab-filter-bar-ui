import { useEffect } from "react";

const nullPosition = {
  position: null,
  top: null,
  left: null,
};

const getDropdownPosition = ({ filter, part }) => {
  // we assume that the markup will not change and that each element clicked will be a direct
  // descendant of the chiclet - see <Chiclet />
  const anchorElement = document.querySelector(`#${filter.id} > .${part}`);
  const { top, bottom, left } = anchorElement.getBoundingClientRect();

  let leftDec = 31;

  if (filter.type === "search-text") {
    leftDec = 22;
  } else if (filter.value?.id?.length) {
    // multi values
    leftDec = 26;
  }

  return {
    position: "absolute",
    top: `${bottom - top}px`,
    left: `${left - leftDec}px`,
  };
};

const setPosition = (dropdownElement, target) => {
  const position = target ? getDropdownPosition(target) : nullPosition;

  dropdownElement.style.position = position.position;
  dropdownElement.style.top = position.top;
  dropdownElement.style.left = position.left;
};

export const useDropdownPosition = (open, edition, insertion) => {
  useEffect(() => {
    const dropdownElement = document.querySelector(".ui.search.dropdown");

    if (!open) {
      setPosition(dropdownElement, null);
      return;
    }

    if (edition) {
      setPosition(dropdownElement, edition);
    } else if (insertion.filter.id !== "root") {
      // we only deals with parens for now (see <ParensGroup />)
      setPosition(dropdownElement, { ...insertion, part: "add-filter" });
    } else {
      setPosition(dropdownElement, null);
    }

    // force a click to work when a chiclet is removed and a partial filter exists
    dropdownElement.querySelector("input.search").click();
  }, [open, edition, insertion]);
};
