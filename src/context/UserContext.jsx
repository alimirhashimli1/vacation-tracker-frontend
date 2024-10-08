import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

const UserContext = createContext(null);

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch("https://vacation-tracker-backend.onrender.com/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Set the user data
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user", error);
        }
      }
      setLoading(false); // Stop loading after user fetch attempt
    };

    fetchUser(); // Fetch user when the app starts
  }, []); // Empty dependency array ensures this runs only once

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
