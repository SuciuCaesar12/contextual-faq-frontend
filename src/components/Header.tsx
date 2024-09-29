import { FaSignOutAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Header = ({ onExploreTopics }: { onExploreTopics: () => void }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
      <button
        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
      <h1 className="text-xl font-semibold">Contextual QA Chat</h1>
      <button
        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={onExploreTopics}
      >
        <FaSearch />
        <span>Explore topics</span>
      </button>
    </header>
  );
};

export default Header;
