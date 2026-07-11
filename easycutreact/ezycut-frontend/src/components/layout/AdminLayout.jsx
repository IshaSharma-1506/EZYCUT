import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

const titleMap = {
  dashboard: "Platform Overview",
  salons: "Salons Controller",
  users: "User Directory",
  payments: "Global Ledger",
  analytics: "Revenue Analytics",
};

const getTitle = (path) => {
  const segment = path.split("/").pop();
  return titleMap[segment] || "Admin Panel";
};

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#f7faf9]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title={getTitle(location.pathname)} />

        <main className="flex-1 overflow-y-auto">
          <div
            key={location.pathname}
            className="max-w-[1400px] mx-auto px-5 md:px-8 py-6 md:py-8 opacity-0 animate-[ezcFadeUp_0.4s_ease_forwards]"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;