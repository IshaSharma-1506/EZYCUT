import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

const titleMap = {
  dashboard: "Dashboard Overview",
  bookings: "Appointments",
  services: "Services Catalog",
  queue: "Live Queue",
  payments: "Earnings",
};

const getTitle = (path) => {
  const segment = path.split("/").pop();
  return titleMap[segment] || "Owner Panel";
};

const OwnerLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#f7faf9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={getTitle(location.pathname)} />
        <main className="flex-1 overflow-y-auto bg-[#f7faf9] p-6 sm:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;