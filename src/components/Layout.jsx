import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useUserContext } from "../context/UserContext";

const Layout = () => {
  const { user } = useUserContext();

  return (
    <div className="flex">
      {/* Pass isAdmin from the user context to Sidebar */}
      <Sidebar isAdmin={user?.isAdmin} />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
