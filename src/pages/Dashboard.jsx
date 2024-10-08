import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import VacationList from "../components/VacationList";
import AddVacation from "../components/AddVacation";
import UserList from "../components/UserList";
import Error from "../components/Error";
import { useUserContext } from "../context/UserContext";

const Dashboard = () => {
  const { user, setUser } = useUserContext();
  const [approvedVacations, setApprovedVacations] = useState([]);
  const [pendingVacations, setPendingVacations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleUserUpdated = (updatedUser) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userResponse = await fetch(
          "https://vacation-tracker-backend.onrender.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          setError(errorData.message);
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const userData = await userResponse.json();
        setUser(userData); // Set user data in context

        if (userData.isAdmin) {
          const usersResponse = await fetch(
            "https://vacation-tracker-backend.onrender.com/api/users/all",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (usersResponse.ok) {
            const allUsersData = await usersResponse.json();
            setAllUsers(allUsersData);
          } else {
            const errorData = await usersResponse.json();
            setError(errorData.message);
          }
        }

        const vacationsResponse = await fetch(
          "https://vacation-tracker-backend.onrender.com/api/vacations/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (vacationsResponse.ok) {
          const allVacations = await vacationsResponse.json();
          setApprovedVacations(
            allVacations.filter((vacation) => vacation.status === "approved")
          );
          setPendingVacations(
            allVacations.filter((vacation) => vacation.status === "pending")
          );
        } else {
          const errorData = await vacationsResponse.json();
          setError(errorData.message);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token, setUser]);

  const handleDeleteUser = (deletedUserId) => {
    setAllUsers(allUsers.filter((user) => user._id !== deletedUserId));
  };

  const handleVacationAdded = async () => {
    try {
      setLoading(true);
      const vacationsResponse = await fetch(
        "https://vacation-tracker-backend.onrender.com/api/vacations/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (vacationsResponse.ok) {
        const allVacations = await vacationsResponse.json();
        setApprovedVacations(
          allVacations.filter((vacation) => vacation.status === "approved")
        );
        setPendingVacations(
          allVacations.filter((vacation) => vacation.status === "pending")
        );
      } else {
        const errorData = await vacationsResponse.json();
        setError(errorData.message);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVacationAction = async (vacationId, action) => {
    try {
      setLoading(true);
      let response;

      // Approve action
      if (action === "approve") {
        response = await fetch("https://vacation-tracker-backend.onrender.com/api/vacations/approve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ vacationId }),
        });
      }

      // Reject action
      else if (action === "reject") {
        response = await fetch("https://vacation-tracker-backend.onrender.com/api/vacations/reject", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ vacationId }),
        });
      }

      // Delete action
      else if (action === "delete") {
        response = await fetch(
          `https://vacation-tracker-backend.onrender.com/api/vacations/${vacationId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Error handling for response
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
      } else {
        handleVacationAdded(); // Refresh vacation list
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-100 min-h-screen p-6 ">
      <div className="flex-grow  mx-full bg-white shadow-md rounded-lg p-6 ">
        <h2 className="text-3xl font-bold text-[#837CD8] mb-6">Dashboard</h2>

        {error && <Error message={error} />}

        {loading ? (
          <div className="text-center text-gray-500 ">Loading data...</div>
        ) : user ? (
          <>
            <div className="flex justify-between space-x-6 mb-6">
              <AddVacation token={token} onVacationAdded={handleVacationAdded} />
              <div className="flex-1">
                <VacationList
                  user={user}
                  vacations={pendingVacations}
                  title="Pending Vacations"
                  onApproveOrReject={handleVacationAction}
                />
              </div>
              <div className="flex-1">
                <VacationList
                  user={user}
                  vacations={approvedVacations}
                  title="Approved Vacations"
                  onApproveOrReject={handleVacationAction}
                />
              </div>
            </div>

            {user.isAdmin && (
              <div className="mt-6">
                <UserList
                  allUsers={allUsers || []}
                  onDelete={handleDeleteUser}
                  onUserUpdated={handleUserUpdated}
                  onApproveOrReject={handleVacationAction}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500">
            No user data available. Please log in.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
