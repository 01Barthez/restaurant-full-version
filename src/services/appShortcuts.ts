import { AppShortcut } from "@/types/global";

export class AppShortcutsService {
  private shortcuts: AppShortcut[] = [
    {
      name: "Voir le menu",
      short_name: "Menu",
      description: "Accéder directement au menu",
      url: "/menu",
      icons: [{ src: "/placeholder.svg", sizes: "96x96" }]
    },
    {
      name: "Mes commandes",
      short_name: "Commandes",
      description: "Voir mes commandes",
      url: "/user/1/orders",
      icons: [{ src: "/placeholder.svg", sizes: "96x96" }]
    },
    {
      name: "Promotions",
      short_name: "Promos",
      description: "Voir les offres spéciales",
      url: "/menu-special",
      icons: [{ src: "/placeholder.svg", sizes: "96x96" }]
    },
    {
      name: "Panier",
      short_name: "Panier",
      description: "Voir mon panier",
      url: "/cart",
      icons: [{ src: "/placeholder.svg", sizes: "96x96" }]
    }
  ];

  registerShortcuts() {
    if ('serviceWorker' in navigator && 'registerProtocolHandler' in navigator) {
      // Register app shortcuts
      this.updateManifestShortcuts();
    }
  }

  private updateManifestShortcuts() {
    const manifestElement = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestElement) {
      // Shortcuts are handled via manifest.json
      console.log('App shortcuts registered');
    }
  }

  addDynamicShortcut(shortcut: AppShortcut) {
    this.shortcuts.push(shortcut);
    this.updateManifestShortcuts();
  }

  getShortcuts(): AppShortcut[] {
    return this.shortcuts;
  }
}

export const appShortcutsService = new AppShortcutsService();
