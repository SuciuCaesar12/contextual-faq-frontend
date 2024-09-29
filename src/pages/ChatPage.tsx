import { useEffect, useState } from "react";
import { TopicDetails } from "../types/topic";
import { ChatDetails, ChatDetailsWithQAs } from "../types/chat";
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import TopicModal from "../components/TopicModal";
import { useAuthStore } from "../stores/useAuthStore";
import { getAvailableTopicsForUser } from "../api/topicApi";
import {
  createChat,
  deleteChat,
  getAllChatsByUser,
  getChatDetailsWithQAs,
} from "../api/chatApi";
import { createQA } from "../api/qaApi";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { user: loggedUser, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showExploreTopicsModal, setShowExploreTopicsModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicDetails | null>(null);
  const [availableTopics, setAvailableTopics] = useState<TopicDetails[]>([]);

  const [inputText, setInputText] = useState<string>("");
  const [selectedChat, setSelectedChat] = useState<ChatDetailsWithQAs | null>(
    null
  );
  const [chats, setChats] = useState<ChatDetails[]>([]);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (loggedUser && loggedUser.id) {
      if (loggedUser?.role === "ADMIN") {
        navigate("/admin");
        return;
      }

      setLoading(true);

      const fetchTopicsAndChats = async (userId: number) => {
        try {
          const [topics, chats] = await Promise.all([
            getAvailableTopicsForUser(userId),
            getAllChatsByUser(userId),
          ]);

          setAvailableTopics(topics);
          setChats(chats);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchTopicsAndChats(loggedUser.id);
    }
  }, [isLoggedIn, loggedUser, navigate]);

  const handleExploreTopics = () => setShowExploreTopicsModal(true);

  const handleCreateNewChat = () => {
    if (
      !(loggedUser && loggedUser.id) ||
      !(selectedTopic && selectedTopic.id)
    ) {
      setError("You must be logged in to create a new chat");
      return;
    }

    createChat(loggedUser.id, selectedTopic.id)
      .then((chat) => {
        setError(null);

        // Update chats array by creating a new reference (React re-renders based on reference changes)
        const updatedChats = [...chats, chat];
        setChats(updatedChats); // Update chats state with the new chat

        // Set the newly created chat as the selected chat
        setSelectedChat({
          ...chat,
          qas: [],
        });

        // remove the topic from available topics
        const updatedAvailableTopics = availableTopics.filter(
          (topic) => topic.id !== selectedTopic.id
        );
        setAvailableTopics(updatedAvailableTopics);

        // Close the modal and reset the selected topic
        setShowExploreTopicsModal(false);
        setSelectedTopic(null);
      })
      .catch((error) => {
        setError("Failed to create chat");
        console.error("Error creating chat:", error);
      });
  };

  const handleCloseModal = () => {
    setShowExploreTopicsModal(false);
    setSelectedTopic(null);
  };

  const handleSendInputText = () => {
    if (!inputText) return;

    if (!(loggedUser && loggedUser.id) || !selectedChat) {
      return;
    }

    setInputText("");

    createQA({
      chat_id: selectedChat.id,
      topic_name: selectedChat.topic.name,
      question: inputText,
      q_timestamp: new Date(),
    })
      .then((receivedQA) => {
        const updatedChat = {
          ...selectedChat,
          qas: [...selectedChat.qas],
        };
        updatedChat.qas.push(receivedQA);

        setSelectedChat({ ...updatedChat });
      })
      .catch((error) => {
        setError("Failed to send message");
        console.error("Error sending message:", error);
      });
  };

  const handleOnSelectChat = (chat: ChatDetails) => {
    if (chat.id !== selectedChat?.id) {
      getChatDetailsWithQAs(chat.id)
        .then((updatedChat) => {
          setSelectedChat(updatedChat);
        })
        .catch((error) => {
          setError("Failed to fetch chat");
          console.error("Error fetching chat:", error);
        });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onExploreTopics={handleExploreTopics} />
      <div className="flex flex-1">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <ChatList
              key="chat-list" // Make sure the key is stable and unrelated to selectedChat
              chats={chats}
              selectedChat={selectedChat}
              onSelectChat={handleOnSelectChat}
              onDeleteChat={(chat: ChatDetails) => {
                deleteChat(chat.id).then(() => {
                  if (chat.id === selectedChat?.id) {
                    setSelectedChat(null); // Reset selectedChat if the current one is deleted
                  }
                  setChats(chats.filter((c) => c.id !== chat.id)); // Update chat list without the deleted chat
                  setAvailableTopics([...availableTopics, chat.topic]); // add the topic to the available topics
                });
              }}
            />

            <main className="flex-1 p-4">
              <ChatWindow
                selectedChat={selectedChat}
                inputText={inputText}
                setInputText={setInputText}
                handleSendText={handleSendInputText}
              />
            </main>
          </>
        )}
      </div>
      {showExploreTopicsModal && (
        <TopicModal
          topics={availableTopics}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          onCreateNewChat={handleCreateNewChat}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ChatPage;
