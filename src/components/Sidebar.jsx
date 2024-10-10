import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { FaTachometerAlt, FaUserAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa'; // Icons
import alitheaBio from "../assets/alithea_bio.png";

const Sidebar = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-64 h-auto bg-[#F0FBFF] text-black font-bold flex flex-col shadow-lg">
      {/* Logo */}
      <Link to="/dashboard" className="pt-7 px-2">
        <img src={alitheaBio} alt="alithea logo" className="w-full h-auto " />
      </Link>

      {/* Navigation */}
      <nav className="flex-grow mt-4 space-y-1">
        <Link
          to="/dashboard"
          className="flex items-center p-4 bg-[#B5B9EC] hover:bg-[#837CD8] rounded-md transition-colors"
        >
          <FaTachometerAlt className="mr-3 text-xl" />
          Dashboard
        </Link>
        <Link
          to="/profile"
          className="flex items-center p-4 bg-[#B5B9EC] hover:bg-[#837CD8] rounded-md transition-colors"
        >
          <FaUserAlt className="mr-3 text-xl" />
          My Profile
        </Link>
        {user?.isAdmin && (
          <Link
            to="/register"
            className="flex items-center p-4 bg-[#B5B9EC] hover:bg-[#837CD8] rounded-md transition-colors"
          >
            <FaUserPlus className="mr-3 text-xl" />
            Register a new user
          </Link>
        )}
        <Link
          to="/"
          onClick={handleLogout}
          className="flex items-center p-4 bg-[#B5B9EC] hover:bg-[#837CD8] rounded-md transition-colors"
        >
          <FaSignOutAlt className="mr-3 text-xl" />
          Log out
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
