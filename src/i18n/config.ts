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