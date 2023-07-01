import { useEffect, useState } from "react";

const useContainerWidthUtils = () => {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateContainerWidth = () => {
      setContainerWidth(window.innerWidth);
    };

    // Update container width initially and on window resize
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  let widthStyle;
  if (containerWidth < 900) {
    widthStyle = containerWidth + "px";
  } else {
    widthStyle = "100%";
  }
  return widthStyle;
};

export default useContainerWidthUtils;
