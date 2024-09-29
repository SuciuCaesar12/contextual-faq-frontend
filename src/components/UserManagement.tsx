import React, { useEffect, useState } from "react";
import { UserCredentials, UserRole } from "../types/user";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  createUser,
  deleteUser,
  getAllUsersDetails,
  updateUser,
} from "../api/userApi";

export interface User {
  id: number | null;
  username: string;
}

const UserManagement: React.FC = () => {
  const { login, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserCredentials[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserCredentials | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }


    const fetchUsers = async () => {
      getAllUsersDetails()
        .then((response) => {
          setUsers(response);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    };

    fetchUsers();
  }, [navigate, isLoggedIn]);

  // Handlers for CRUD operations
  const handleCreateUser = () => {
    setIsEditing(false);
    setSelectedUser({ id: null, username: "", password: "", role: "USER" });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserCredentials) => {
    setIsEditing(true);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: number | null) => {
    // Logic to delete user
    if (!userId) {
      return;
    }

    deleteUser(userId)
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
    console.log("Delete User:", userId);
  };


  const handleSaveUser = () => {
    // Logic to save or update user
    console.log("Save User:", selectedUser);
    if (isEditing) {
      if (selectedUser?.id) {
        updateUser(
          selectedUser?.id,
          selectedUser?.username,
          selectedUser?.password,
          selectedUser?.role
        )
          .then(() => {
            setUsers(
              users.map((user) =>
                user.id === selectedUser?.id ? selectedUser : user
              )
            );
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      }
    } else {
      if (selectedUser) {
        createUser(selectedUser?.username, selectedUser?.password, selectedUser?.role)
          .then((user) => {
            setUsers([...users, user]);
          })
          .catch((error) => {
            console.error("Error creating user:", error);
          });
      }
    }

    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    }
  };

  const isUserRole = (value: any): value is UserRole => {
    return value === "USER" || value === "ADMIN";
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (isUserRole(value) && selectedUser) {
      setSelectedUser({ ...selectedUser, role: value });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <button
        onClick={handleCreateUser}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New User
      </button>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Username</th>
            <th className="text-left p-4">Password</th>
            <th className="text-right p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-4">{user.id}</td>
              <td className="p-4">{user.username}</td>
              <td className="p-4">
                {"********"}
              </td>
              <td className="p-4 text-right">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
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
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit User" : "Create User"}
            </h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={selectedUser?.username || ""}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={selectedUser?.password || ""}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <select
              name="role"
              value={selectedUser?.role || ""}
              onChange={handleSelectChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
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

export default UserManagement;
