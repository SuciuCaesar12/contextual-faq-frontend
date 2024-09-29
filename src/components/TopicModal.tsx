import { FaTimes } from "react-icons/fa";
import { TopicDetails } from "../types/topic";

const TopicModal = ({
  topics,
  selectedTopic,
  onSelectTopic,
  onCreateNewChat,
  onClose,
}: {
  topics: TopicDetails[];
  selectedTopic: TopicDetails | null;
  onSelectTopic: (topic: TopicDetails) => void;
  onCreateNewChat: () => void;
  onClose: () => void;
}) => {
  return (
    <div className="modal fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="modal-content w-full max-w-sm p-6 bg-white rounded-md shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Explore topics</h2>
        <div className="overflow-y-auto max-h-96">
          <ul className="space-y-2">
            {topics.map((topic) => (
              <li
                key={topic.id}
                style={
                  topic.id === selectedTopic?.id
                    ? { backgroundColor: "lightblue" }
                    : {}
                }
                onClick={() => onSelectTopic(topic)}
                className="p-2 rounded-md cursor-pointer hover:bg-gray-300"
              >
                {topic.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={onCreateNewChat}
          >
            Create new chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicModal;
