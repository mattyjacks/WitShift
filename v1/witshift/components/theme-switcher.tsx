"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme("light"); }, [setTheme]);
  return null;
};

export { ThemeSwitcher };
