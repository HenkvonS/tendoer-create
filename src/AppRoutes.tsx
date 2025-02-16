
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Create from "@/pages/tenders/Create";
import Edit from "@/pages/tenders/Edit";
import View from "@/pages/tenders/View";
import TEDTenders from "@/pages/tenders/TED";
import Settings from "@/pages/settings/Index";
import AISettings from "@/pages/settings/AISettings";
import Vendors from "@/pages/vendors/Index";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tenders/create" element={<Create />} />
      <Route path="/tenders/edit/:id" element={<Edit />} />
      <Route path="/tenders/view/:id" element={<View />} />
      <Route path="/tenders/ted" element={<TEDTenders />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/ai" element={<AISettings />} />
      <Route path="/vendors" element={<Vendors />} />
    </Routes>
  );
};

export default AppRoutes;
