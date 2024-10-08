import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isWeekend } from 'date-fns';
import PropTypes from 'prop-types';

// List of German holidays for 2024
const germanHolidays = [
  new Date('2024-01-01'), // New Year's Day
  new Date('2024-04-01'), // Easter Monday
  new Date('2024-05-01'), // Labor Day
  new Date('2024-05-09'), // Ascension Day
  new Date('2024-06-20'), // Corpus Christi
  new Date('2024-10-03'), // German Unity Day
  new Date('2024-12-25'), // Christmas Day
  new Date('2024-12-26'), // Boxing Day
];

const EditVacation = ({ token, vacation, onVacationUpdated, onClose }) => {
  const [startDate, setStartDate] = useState(new Date(vacation.startDate));
  const [endDate, setEndDate] = useState(new Date(vacation.endDate));
  const [type, setType] = useState(vacation.type);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to check if a date is a weekend or a German holiday
  const isGermanHolidayOrWeekend = (date) => {
    const isHoliday = germanHolidays.some(
      (holiday) => holiday.toDateString() === date.toDateString()
    );
    return isWeekend(date) || isHoliday; // Disable weekends and holidays
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      const response = await fetch(`https://vacation-tracker-backend.onrender.com/api/vacations/${vacation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate,
          endDate,
          type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
      } else {
        setSuccess('Vacation successfully updated!');
        onVacationUpdated(); // Call callback to refresh vacation list
        onClose(); // Close the edit modal
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="edit-vacation-container mt-8 p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Edit Vacation</h2>
      {error && <p className="error-message text-red-600 mb-4 text-center">{error}</p>}
      {success && <p className="success-message text-[#837CD8] mb-4 text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Vacation Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9796E3]"
          >
            <option value="Urlaub">Urlaub</option>
            <option value="Krankheit">Krankheit</option>
            <option value="Mutterschutz">Mutterschutz</option>
            <option value="Elternzeit">Elternzeit</option>
            <option value="Pflegezeit">Pflegezeit</option>
            <option value="Miscellaneous">Miscellaneous</option>
            <option value="Kindkrankentage">Kindkrankentage</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            filterDate={(date) => !isGermanHolidayOrWeekend(date)}
            placeholderText="Select a start date"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            minDate={new Date()} // Ensure dates before today aren't selectable
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            filterDate={(date) => !isGermanHolidayOrWeekend(date)}
            placeholderText="Select an end date"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9796E3]"
            minDate={startDate || new Date()} // Ensure end date is after start date
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#837CD8] text-white p-2 rounded-lg hover:bg-[#7262C9] transition"
        >
          Update Vacation
        </button>
      </form>
      <button onClick={onClose} className="mt-4 w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition">
        Cancel
      </button>
    </div>
  );
};

EditVacation.propTypes = {
  token: PropTypes.string.isRequired,
  vacation: PropTypes.object.isRequired,
  onVacationUpdated: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditVacation;
