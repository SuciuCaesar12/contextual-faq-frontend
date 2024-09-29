import React, { useEffect, useState } from "react";
import { ChatDetails } from "../types/chat";
import { deleteChat, getAllChatsDetails } from "../api/chatApi";

export interface Chat {
  id: number;
  user_id: number;
  topic_id: number;
}

const ChatManagement: React.FC = () => {
  const [chats, setChats] = useState<ChatDetails[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      getAllChatsDetails()
        .then((response) => {
          setChats(response);
        })
        .catch((error) => {
          console.error("Error fetching chats:", error);
        });
    };

    fetchChats();
  }, []);

  // Handler to delete a chat
  const handleDeleteChat = (chatId: number) => {
    deleteChat(chatId)
      .then(() => {
        setChats(chats.filter((chat) => chat.id !== chatId));
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat Management</h1>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">User</th>
            <th className="text-left p-4">Topic</th>
            <th className="text-right p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {chats.map((chat) => (
            <tr key={chat.id} className="border-b">
              <td className="p-4">{chat.id}</td>
              <td className="p-4">{chat.user?.username || "Unknown User"}</td>
              <td className="p-4">{chat.topic.name}</td>
              <td className="p-4 text-right">
                <button
                  onClick={() => handleDeleteChat(chat.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChatManagement;
