import { ChatDetailsWithQAs } from "../types/chat";
import { useEffect, useRef } from "react";

const ChatWindow = ({
  selectedChat,
  inputText,
  setInputText,
  handleSendText,
}: {
  selectedChat: ChatDetailsWithQAs | null;
  inputText: string;
  setInputText: (text: string) => void;
  handleSendText: () => void;
}) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.qas.length]); // Detect change in QAs length to scroll to the bottom

  if (!selectedChat) {
    return (
      <div className="flex-1 flex justify-center items-center ">
        <p className="text-center text-4xl font-bold">
          Select a chat to view its messages
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col h-full">
      <h2 className="text-3xl font-bold mb-6">{selectedChat.topic.name}</h2>

      {/* Chat message container with scrolling */}
      <div className="flex-1 bg-gray-100 p-4 rounded-md shadow-md overflow-y-auto">
        <div className="max-h-full">
          {selectedChat.qas
            .slice()
            .sort(
              (a, b) =>
                new Date(a.q_timestamp).getTime() -
                new Date(b.q_timestamp).getTime()
            )
            .map((qa) => (
              <div key={qa.id} className="mb-4 bg-gray-200 p-4 rounded-lg">
                <p className="font-semibold text-lg mb-1">{qa.question}</p>
                <p className="ml-4 text-gray-700">{qa.answer}</p>
                <p className="text-sm text-gray-400">
                  {new Date(qa.q_timestamp).toLocaleTimeString()}
                  {(() => {
                    switch (qa.a_source) {
                      case "SYSTEM":
                        return " - Cached from the System";
                      case "OPENAI":
                        return " - Answered by Chatgpt";
                      default:
                        return "";
                    }
                  })()}
                </p>
              </div>
            ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>

      {/* Input field */}
      <div className="mt-6 flex items-center justify-between p-4 border-t border-gray-300">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Ask a question..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendText();
            }
          }}
        />
        <button
          onClick={handleSendText}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md ml-2"
          disabled={!inputText} // Disable send button if input is empty
        >
          Send
        </button>
      </div>
    </section>
  );
};

export default ChatWindow;
