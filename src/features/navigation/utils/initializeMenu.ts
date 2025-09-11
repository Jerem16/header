// src/utils/initializeMenu.ts
import { attachContentToMenu } from "@nav-data/utils/attachContent";
import { menuItems } from "@nav-data/menuItems";
import { contentIndex } from "@nav-data/content/index";

export function initializeMenuWithContent() {
  return attachContentToMenu(menuItems, contentIndex);
}
