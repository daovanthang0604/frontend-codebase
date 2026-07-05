// Core sidebar components
export {
  SidebarCollapseTrigger,
  // Content components
  SidebarContent,
  SidebarDrawerContent,
  // Drawer (mobile)
  SidebarDrawerOverlay,
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  // Provider
  SidebarProvider,
  // Navigation components
  SidebarSeparator,
  // Triggers
  SidebarTrigger,
  SidebarViewport,
  useAutoScroll,
  useFolder,
  useFolderDepth,
  // Hooks
  useSidebar,
  type SidebarFolderLinkProps,
  type SidebarFolderProps,
  type SidebarItemProps,
  // Types
  type SidebarProviderProps,
  type SidebarViewportProps,
} from "./Sidebar"

// Page tree renderer
export {
  SidebarPageTree,
  type PageTreeFolder,
  type PageTreeItem,
  type PageTreeNode,
  type PageTreeRoot,
  type PageTreeSeparator,
  type SidebarPageTreeComponents,
} from "./PageTree"

// Link item renderer
export { SidebarLinkItem, type LinkItemType } from "./LinkItem"

// Tabs dropdown
export {
  isTabActive,
  SidebarTabsDropdown,
  type SidebarTab,
  type SidebarTabsDropdownProps,
  type SidebarTabWithProps,
} from "./Tabs"

export {
  isActivePath,
  SidebarNavTree,
  type SidebarNavFolder,
  type SidebarNavItem,
  type SidebarNavNode,
} from "./SidebarNavTree"
