"use client";

import { useEffect, useState } from "react";

export const useMobile = (breakPoint: number = 786) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < breakPoint);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, [breakPoint]);
  return isMobile;
};
