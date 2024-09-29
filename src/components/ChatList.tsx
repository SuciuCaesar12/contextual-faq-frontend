import { useState } from "react";
import { ChatDetails, ChatDetailsWithQAs } from "../types/chat";
import { FaTrash } from "react-icons/fa";

const ChatList = ({
  chats,
  selectedChat,
  onSelectChat,
  onDeleteChat,
}: {
  chats: ChatDetails[];
  selectedChat: ChatDetailsWithQAs | null;
  onSelectChat: (chat: ChatDetails) => void;
  onDeleteChat: (chat: ChatDetails) => void;
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<ChatDetails | null>(null);

  const handleDeleteChat = (chat: ChatDetails) => {
    setChatToDelete(chat);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (chatToDelete) {
      onDeleteChat(chatToDelete);
      setShowDeleteModal(false);
    }
  };

  return (
    <aside className="w-1/5 bg-gray-100 p-4 border-r h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ul className="overflow-y-scroll max-h-full">
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`p-3 mb-2 rounded-md cursor-pointer ${
              selectedChat?.id === chat.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{chat.topic.name}</span>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat);
                }}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-50">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete chat?</h2>
            <p className="mb-4">Are you sure you want to delete this chat?</p>
            <div className="flex space-x-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleConfirmDelete}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ChatList;
