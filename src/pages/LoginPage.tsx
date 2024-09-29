import React, { useEffect, useState } from "react";
import { User } from "../types/user";
import { AuthToken, useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";

const LoginPage: React.FunctionComponent = () => {
  const { login, isLoggedIn } = useAuthStore.getState();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/chat");
    }
  }, [navigate, isLoggedIn]);

  // Generic function to handle form submission for both login and register
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement>,
    action: "login" | "register"
  ) => {
    event.preventDefault();

    if (username === "" || password === "") {
      setError("Please fill in both fields.");
      return;
    }
    setError(null);

    if (action === "login") {
      try {
        loginUser(username, password)
          .then((response) => {
            const { user_id, access_token, expiry, role } = response;
            const user: User = {
              id: user_id,
              role,
              username,
            };
            const token: AuthToken = {
              token: access_token,
              expiry,
            };
            login(user, token);

            if (role === "ADMIN") {
              navigate("/admin");
            } else {
              navigate("/chat");
            }
          })
          .catch((error) => {
            console.error("Login failed:", error);
            setError("Login failed. Please try again.");
          });

        // Clear input fields after successful submission
        setUsername("");
        setPassword("");
      } catch (error) {
        console.error(`${action} error:`, error);
        setError(`Failed to ${action}. Please try again.`);
      }
    } else {
      registerUser(username, password)
        .then((response) => {
          const { user_id, access_token, expiry, role } = response;
          const user: User = {
            id: user_id,
            role,
            username,
          };
          const token: AuthToken = {
            token: access_token,
            expiry,
          };

          login(user, token); // Update the Zustand store

          if (role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/chat");
          }
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          setError("Registration failed. Please try again.");
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Login or Register</h2>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-lg font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Buttons for Login and Register */}
        <div className="flex justify-evenly space-x-4 mt-4">
          <button
            type="submit"
            className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-200 hover:bg-gray-300"
            onClick={(event) => handleSubmit(event, "login")}
            disabled={!username || !password} // Disable button if fields are empty
          >
            Login
          </button>
          <button
            type="submit"
            className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-200 hover:bg-gray-300"
            onClick={(event) => handleSubmit(event, "register")}
            disabled={!username || !password} // Disable button if fields are empty
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
