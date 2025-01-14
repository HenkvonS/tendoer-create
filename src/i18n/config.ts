import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: {
        title: "Tender Management Dashboard",
        subtitle: "Manage and track all your tender processes efficiently",
      },
      stats: {
        totalTenders: "Total Tenders",
        activeTenders: "Active Tenders",
        participatingVendors: "Participating Vendors",
        pendingReviews: "Pending Reviews",
      },
      actions: {
        search: "Search tenders...",
        createTender: "Create Tender",
      },
      tender: {
        deadline: "Deadline",
        budget: "Budget",
        status: {
          draft: "Draft",
          active: "Active",
          closed: "Closed"
        }
      },
      menu: {
        quickFind: "Quick Find",
        dashboard: "Dashboard",
        quickAccess: "Quick Access",
        allTenders: "All Tenders",
        recent: "Recent",
        workspaces: "Workspaces",
        activeTenders: "Active Tenders",
        draftTenders: "Draft Tenders",
        vendors: "Vendors",
        settings: "Settings",
        logout: "Logout"
      }
    },
  },
  es: {
    translation: {
      dashboard: {
        title: "Panel de Gestión de Licitaciones",
        subtitle: "Gestione y realice un seguimiento de todos sus procesos de licitación de manera eficiente",
      },
      stats: {
        totalTenders: "Licitaciones Totales",
        activeTenders: "Licitaciones Activas",
        participatingVendors: "Proveedores Participantes",
        pendingReviews: "Revisiones Pendientes",
      },
      actions: {
        search: "Buscar licitaciones...",
        createTender: "Crear Licitación",
      },
      tender: {
        deadline: "Fecha límite",
        budget: "Presupuesto",
        status: {
          draft: "Borrador",
          active: "Activa",
          closed: "Cerrada"
        }
      },
      menu: {
        quickFind: "Búsqueda Rápida",
        dashboard: "Panel",
        quickAccess: "Acceso Rápido",
        allTenders: "Todas las Licitaciones",
        recent: "Recientes",
        workspaces: "Espacios de Trabajo",
        activeTenders: "Licitaciones Activas",
        draftTenders: "Licitaciones en Borrador",
        vendors: "Proveedores",
        settings: "Configuración",
        logout: "Cerrar Sesión"
      }
    },
  },
  de: {
    translation: {
      dashboard: {
        title: "Ausschreibungsmanagement-Dashboard",
        subtitle: "Verwalten und verfolgen Sie alle Ihre Ausschreibungsprozesse effizient",
      },
      stats: {
        totalTenders: "Gesamtausschreibungen",
        activeTenders: "Aktive Ausschreibungen",
        participatingVendors: "Teilnehmende Anbieter",
        pendingReviews: "Ausstehende Überprüfungen",
      },
      actions: {
        search: "Ausschreibungen suchen...",
        createTender: "Ausschreibung erstellen",
      },
      tender: {
        deadline: "Frist",
        budget: "Budget",
        status: {
          draft: "Entwurf",
          active: "Aktiv",
          closed: "Geschlossen"
        }
      },
      menu: {
        quickFind: "Schnellsuche",
        dashboard: "Dashboard",
        quickAccess: "Schnellzugriff",
        allTenders: "Alle Ausschreibungen",
        recent: "Kürzlich",
        workspaces: "Arbeitsbereiche",
        activeTenders: "Aktive Ausschreibungen",
        draftTenders: "Ausschreibungsentwürfe",
        vendors: "Anbieter",
        settings: "Einstellungen",
        logout: "Abmelden"
      }
    },
  },
  sv: {
    translation: {
      dashboard: {
        title: "Upphandlingshantering",
        subtitle: "Hantera och följ alla dina upphandlingsprocesser effektivt",
      },
      stats: {
        totalTenders: "Totala upphandlingar",
        activeTenders: "Aktiva upphandlingar",
        participatingVendors: "Deltagande leverantörer",
        pendingReviews: "Väntande granskningar",
      },
      actions: {
        search: "Sök upphandlingar...",
        createTender: "Skapa upphandling",
      },
      tender: {
        deadline: "Tidsfrist",
        budget: "Budget",
        status: {
          draft: "Utkast",
          active: "Aktiv",
          closed: "Avslutad"
        }
      },
      menu: {
        quickFind: "Snabbsökning",
        dashboard: "Översikt",
        quickAccess: "Snabbåtkomst",
        allTenders: "Alla upphandlingar",
        recent: "Senaste",
        workspaces: "Arbetsytor",
        activeTenders: "Aktiva upphandlingar",
        draftTenders: "Upphandlingsutkast",
        vendors: "Leverantörer",
        settings: "Inställningar",
        logout: "Logga ut"
      }
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;