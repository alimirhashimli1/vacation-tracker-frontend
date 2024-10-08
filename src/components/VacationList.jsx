import PropTypes from 'prop-types';
import EditVacation from './EditVacation'; 
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserAlt, FaCheck, FaTimes, FaTrash, FaEdit } from 'react-icons/fa'; // Icons

const VacationList = ({ user, vacations, onApproveOrReject, title }) => {
  const [editingVacation, setEditingVacation] = useState(null); 
  const [myToken, setToken] = useState(null);

  const handleVacationUpdated = () => {
    onApproveOrReject(); // Refresh after editing
  };

  const handleCloseEdit = () => {
    setEditingVacation(null); // Close the edit component
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  return (
    <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-4">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {vacations.length > 0 ? (
        <ul>
          {vacations.map((vacation) => (
            <li key={vacation._id} className="border-b py-4">
              <h4 className="font-semibold flex items-center">
                <FaUserAlt className="mr-2 text-gray-600" />
                Vacation for <span className='text-[#FE5711] ml-1'>{vacation.userName}</span>
              </h4>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-600" />
                  <p>Type: {vacation.type}</p>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-600" />
                  <p>From: {new Date(vacation.startDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-600" />
                  <p>To: {new Date(vacation.endDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-600" />
                  <p>Total Days: {Math.ceil((new Date(vacation.endDate) - new Date(vacation.startDate)) / (1000 * 60 * 60 * 24)) + 1}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex space-x-2">
                {user.isAdmin ? (
                  <>
                    {vacation.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => onApproveOrReject(vacation._id, 'approve')}
                          className="flex items-center bg-[#837CD8] text-white px-4 py-2 rounded-lg mr-2 hover:bg-[#6b66b0] transition-colors"
                        >
                          <FaCheck className="mr-2" /> Approve
                        </button>
                        <button
                          onClick={() => onApproveOrReject(vacation._id, 'reject')}
                          className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="mr-2" /> Reject
                        </button>
                      </>
                    ) : vacation.status === 'approved' ? (
                      <button
                        onClick={() => onApproveOrReject(vacation._id, 'delete')}
                        className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    ) : null}
                  </>
                ) : vacation.userId === user._id ? (
                  <>
                    {!editingVacation && (
                      <>
                        <button
                          onClick={() => setEditingVacation(vacation)}
                          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600 transition-colors"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => onApproveOrReject(vacation._id, 'delete')}
                          className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </>
                    )}
                    {editingVacation && (
                      <EditVacation
                        token={myToken}
                        vacation={editingVacation}
                        onVacationUpdated={handleVacationUpdated}
                        onClose={handleCloseEdit}
                      />
                    )}
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No vacations available.</p>
      )}
    </div>
  );
};

VacationList.propTypes = {
  user: PropTypes.object.isRequired,
  vacations: PropTypes.array.isRequired,
  onApproveOrReject: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default VacationList;
