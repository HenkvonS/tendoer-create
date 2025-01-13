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
      },
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
      },
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
      },
    },
  },
  sv: {
    translation: {
      dashboard: {
        title: "Anbudshanteringspanel",
        subtitle: "Hantera och spåra alla dina anbudsprocesser effektivt",
      },
      stats: {
        totalTenders: "Totala anbud",
        activeTenders: "Aktiva anbud",
        participatingVendors: "Deltagande leverantörer",
        pendingReviews: "Väntande granskningar",
      },
      actions: {
        search: "Sök anbud...",
        createTender: "Skapa anbud",
      },
      tender: {
        deadline: "Tidsfrist",
        budget: "Budget",
      },
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