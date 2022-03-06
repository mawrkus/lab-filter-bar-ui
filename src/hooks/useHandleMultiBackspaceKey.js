import { useState, useEffect } from "react";

// Hooks, really?! This is crazy...
export const useHandleMultiBackspaceKey = (onBackspace, selectedValue) => {
  const [enable, setEnable] = useState(!selectedValue.length);

  useEffect(() => {
    if (selectedValue.length) {
      setEnable(false);
      return;
    }

    if (!enable) {
      setEnable(true);
      return;
    }


    const onKeyDown = (e) => {
      if (e.code === "Backspace" && e.target.value === "") {
        onBackspace(e);
      }
    };

    const searchInputElement = document.querySelector(
      ".ui.dropdown.search > input.search"
    );

    searchInputElement.addEventListener("keydown", onKeyDown);

    return () => {
      searchInputElement.removeEventListener("keydown", onKeyDown);
    };
  }, [onBackspace, selectedValue.length, enable]);
};
