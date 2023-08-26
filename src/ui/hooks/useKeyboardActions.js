import { useEffect } from "react";

export const useKeyboardActions = () => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (document.activeElement.closest(".chiclet")) {
        if (["Enter", "ArrowDown"].includes(e.code)) {
          document.activeElement.click();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener(onKeyDown);
    };
  }, []);
};
