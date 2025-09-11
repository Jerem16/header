import { MenuLinks } from "@nav-types/menu";
import { Content } from "@nav-types/content"; // Assurez-vous d'importer Content

export function attachContentToMenu(
  menu: MenuLinks,
  contentIndex: Record<string, Content[]>,
): MenuLinks {
  const updatedMenu = { ...menu };

  updatedMenu.mainLink = updatedMenu.mainLink.map((link) => ({
    ...link,
    subItems: link.subItems?.map((subItem) => ({
      ...subItem,
      content: contentIndex[subItem.AnchorId] || null,
    })),
  }));
  return updatedMenu;
}
