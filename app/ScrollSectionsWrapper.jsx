// ScrollSectionsWrapper.js
"use client";

import React from "react";
import { useScrollAnchors } from "@nav-utils/scrollUtils";
import { sections } from "@nav-data/sections";

const ScrollSectionsWrapper = ({ children }) => {
  useScrollAnchors(sections);
  return <>{children}</>;
};

export default ScrollSectionsWrapper;
