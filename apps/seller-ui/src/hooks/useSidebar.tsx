"use client";

import { activeSideBarItem } from "../configs/constants";
import { useAtom } from "jotai";

const useSidebar = () => {
  const [activeSideBar, setActiveSideBar] = useAtom(activeSideBarItem);
  return { activeSideBar, setActiveSideBar };
};

export default useSidebar;
