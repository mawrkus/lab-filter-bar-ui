import { useEffect } from "react";

export const useKeyboardActions = () => {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (document.activeElement.closest(".chiclet")) {
        if (["Enter", "ArrowDown"].includes(e.code)) {
          document.activeElement.click();
        }
      }
    });
  }, []);
};
