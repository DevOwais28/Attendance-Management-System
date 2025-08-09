import { useState } from "react";
import { useMotionValue } from "framer-motion";

export function useExpandable(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);
  const animatedHeight = useMotionValue(0); // Motion value for animation

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const expand = () => setIsExpanded(true);
  const collapse = () => setIsExpanded(false);

  return { isExpanded, toggleExpand, expand, collapse, animatedHeight };
}
