import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import BuyerDashboard from "./dashboards/BuyerDashboard";
import SellerDashboard from "./dashboards/SellerDashboard";
import RiderDashboard from "./dashboards/RiderDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (!user.role) return <Navigate to="/select-role" replace />;

  switch (user.role) {
    case "buyer":
      return <BuyerDashboard />;
    case "seller":
      return <SellerDashboard />;
    case "rider":
      return <RiderDashboard />;
    default:
      return null;
  }
};

export default Dashboard;
