import { useUserContext } from "../context/UserContext";
import { FaUserAlt, FaEnvelope, FaPhone, FaSuitcase, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns'; // To format dates

const Profile = () => {
  const { user, loading } = useUserContext();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found. Please log in.</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center space-x-4">
          <div className="bg-[#FE5711] text-white p-3 rounded-full">
            <FaUserAlt className="text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            Profile of <span className="text-[#FE5711]">{user.name}</span>
          </h3>
        </div>

        {/* Personal Details Section */}
        <div className="mt-6 space-y-4">
          <h4 className="text-xl font-semibold text-gray-700">Personal Information</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <FaSuitcase className="text-gray-500" />
              <p><strong>Position:</strong> {user.position}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-gray-500" />
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone className="text-gray-500" />
              <p><strong>Phone:</strong> {user.phone}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300" />

        {/* Vacation Details Section */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-700">Vacation Information</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-500" />
              <p><strong>Total Vacation Days:</strong> {user.vacationDaysTotal}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-500" />
              <p><strong>Used Vacation Days:</strong> {user.vacationDaysUsed}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300" />

        {/* User's Vacations Section */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-700">Your Vacations</h4>
          {user.vacations && user.vacations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {user.vacations.map((vacation) => (
                <div
                  key={vacation._id}
                  className="p-4 bg-gray-50 rounded-md shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p><strong>Type:</strong> {vacation.type}</p>
                    <p><strong>Status:</strong> <span className={`text-${vacation.status === 'approved' ? 'green' : 'red'}-500 capitalize`}>{vacation.status}</span></p>
                    <p><strong>Vacation Days Used:</strong> {vacation.type === 'Urlaub' ? `${vacation.vacationDaysUsed}` : '0'}</p>
                    <p><strong>Start Date:</strong> {format(new Date(vacation.startDate), 'MMMM d, yyyy')}</p>
                    <p><strong>End Date:</strong> {format(new Date(vacation.endDate), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No vacations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
