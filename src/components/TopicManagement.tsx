import React, { useEffect, useState } from "react";
import { TopicDetails } from "../types/topic";
import { createTopic, deleteTopic, getAllTopicsDetails } from "../api/topicApi";

export interface Topic {
  id: number;
}

const TopicManagement: React.FC = () => {
  const [topics, setTopics] = useState<TopicDetails[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTopics = async () => {
      getAllTopicsDetails()
        .then((response) => {
          setTopics(response);
        })
        .catch((error) => {
          console.error("Error fetching topics:", error);
        });
    };

    fetchTopics();
  }, []);

  // Handlers for CRUD operations
  const handleCreateTopic = () => {
    setSelectedTopic({ id: 0, name: "" });
    setIsModalOpen(true);
  };

  const handleDeleteTopic = (topicId: number) => {
    deleteTopic(topicId)
      .then(() => {
        setTopics(topics.filter((topic) => topic.id !== topicId));
      })
      .catch((error) => {
        console.error("Error deleting topic:", error);
      });
  };

  const handleSaveTopic = () => {
    if (selectedTopic) {
      createTopic(selectedTopic.name)
        .then((newTopic) => {
          setTopics([...topics, newTopic]);
        })
        .catch((error) => {
          console.error("Error creating topic:", error);
        });
    }
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedTopic) {
      setSelectedTopic({ ...selectedTopic, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Topic Management</h1>

      <button
        onClick={handleCreateTopic}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New Topic
      </button>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Name</th>
            <th className="text-right p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((topic) => (
            <tr key={topic.id} className="border-b">
              <td className="p-4">{topic.id}</td>
              <td className="p-4">{topic.name}</td>
              <td className="p-4 text-right">
                <button
                  onClick={() => {
                    if (topic.id) {
                      setSelectedTopic(topic);
                      handleDeleteTopic(topic.id);
                    }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Create Topic</h2>
            <input
              type="text"
              name="name"
              placeholder="Topic Name"
              value={selectedTopic?.name || ""}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTopic}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicManagement;
