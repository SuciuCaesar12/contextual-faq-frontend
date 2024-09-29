import React, { useEffect, useState } from "react";
import UserManagement from "../components/UserManagement";
import TopicManagement from "../components/TopicManagement";
import ChatManagement from "../components/ChatManagement";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const Layout: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("user");
  const { logout } = useAuthStore.getState();
  const { user: loggedUser } = useAuthStore.getState();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser && loggedUser?.role === "USER") {
      navigate("/chat");
    }
  }, [loggedUser, navigate]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-around">
          <button
            onClick={() => setActiveComponent("user")}
            className={`px-4 py-2 rounded ${
              activeComponent === "user" ? "bg-blue-700" : "bg-blue-500"
            } text-white`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveComponent("topic")}
            className={`px-4 py-2 rounded ${
              activeComponent === "topic" ? "bg-green-700" : "bg-green-500"
            } text-white`}
          >
            Topic Management
          </button>
          <button
            onClick={() => setActiveComponent("chat")}
            className={`px-4 py-2 rounded ${
              activeComponent === "chat" ? "bg-purple-700" : "bg-purple-500"
            } text-white`}
          >
            Chat Management
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-4 py-2 rounded bg-red-500 text-white"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        {activeComponent === "user" && <UserManagement />}
        {activeComponent === "topic" && <TopicManagement />}
        {activeComponent === "chat" && <ChatManagement />}
      </main>
    </div>
  );
};

export default Layout;
