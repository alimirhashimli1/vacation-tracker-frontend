import PropTypes from "prop-types";
import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const UserList = ({ allUsers, onDelete, onUserUpdated }) => {
  const [editingUser, setEditingUser] = useState(null); // Holds the user being edited
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    phone: '',
    vacationDaysTotal: 0,
    vacationDaysUsed: 0,
    isAdmin: false,
  });

  const handleEditClick = (user) => {
    setEditingUser(user);  // Open the edit modal/form with the user's current data
    setFormData({
      name: user.name,
      email: user.email,
      position: user.position,
      phone: user.phone,
      vacationDaysTotal: user.vacationDaysTotal,
      vacationDaysUsed: user.vacationDaysUsed,
      isAdmin: user.isAdmin,
    });
  };



  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`https://vacation-tracker-backend.onrender.com/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        onDelete(userId);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://vacation-tracker-backend.onrender.com/api/users/${editingUser._id}`, {
        method: 'PUT', // Use PUT for update
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const updatedUser = await response.json();
      onUserUpdated(updatedUser.user);  // Update the parent state
      setEditingUser(null);  // Close the edit form
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,  // Handle checkbox (isAdmin) properly
    });
  };

  return (
    <div className="add-vacation-container mt-8 p-6 max-w-4xl  bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">All Users and Their Vacations</h3>
      {allUsers.length > 0 ? (
        <div className="flex flex-wrap -mx-4">
          {allUsers.map((user) => (
            <div key={user._id} className="relative w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditClick(user)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(user._id)}>
                    <FaTrashAlt />
                  </button>
                </div>

                <h4 className="font-semibold mb-2">User: <span className="text-[#FE5711]">{user.name}</span></h4>
                <p className="text-sm mb-2"><strong>Email:</strong> {user.email}</p>
                <p className="text-sm mb-2"><strong>Total Vacation Days:</strong> {user.vacationDaysTotal}</p>
                <p className="text-sm mb-4"><strong>Used Vacation Days:</strong> {user.vacationDaysUsed}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No users available.</p>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Edit User: {editingUser.name}</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Total Vacation Days</label>
                <input
                  type="number"
                  name="vacationDaysTotal"
                  value={formData.vacationDaysTotal}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Used Vacation Days</label>
                <input
                  type="number"
                  name="vacationDaysUsed"
                  value={formData.vacationDaysUsed}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Admin</label>
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#837CD8] text-white py-2 px-4 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

UserList.propTypes = {
  allUsers: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUserUpdated: PropTypes.func.isRequired, // New prop to handle user updates
};

export default UserList;
