import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isWeekend } from 'date-fns';
import PropTypes from 'prop-types';
import { FaCalendarAlt, FaPlaneDeparture } from 'react-icons/fa'; // Import relevant icons

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

const AddVacation = ({ token, onVacationAdded }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [type, setType] = useState('Urlaub');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State for success message

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
      const response = await fetch('https://vacation-tracker-backend.onrender.com/api/vacations/', {
        method: 'POST',
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
        setSuccess('Vacation successfully added!');
        onVacationAdded(); // Call callback to refresh vacation list
        setStartDate(null);
        setEndDate(null);
        setType('Urlaub');
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="add-vacation-container mt-8 p-6 max-w-4xl bg-white rounded-lg shadow-md w-1/3">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center">
        <FaPlaneDeparture className="mr-2 text-[#837CD8]" /> Add Vacation
      </h2>

      {/* Error or success messages */}
      {error && <p className="error-message text-red-600 mb-4 text-center">{error}</p>}
      {success && <p className="success-message text-[#837CD8] mb-4 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vacation Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Vacation Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#837CD8]"
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

        {/* Start Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Start Date:</label>
          <div className="relative">
            <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              filterDate={(date) => !isGermanHolidayOrWeekend(date)}
              placeholderText="Select a start date"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#837CD8]"
              minDate={new Date()} // Ensure dates before today aren't selectable
            />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">End Date:</label>
          <div className="relative">
            <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              filterDate={(date) => !isGermanHolidayOrWeekend(date)}
              placeholderText="Select an end date"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#837CD8]"
              minDate={startDate || new Date()} // Ensure end date is after start date
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#837CD8] text-white p-2 rounded-lg hover:bg-[#6252B0] transition"
        >
          Add Vacation
        </button>
      </form>
    </div>
  );
};

// Define prop types for validation
AddVacation.propTypes = {
  token: PropTypes.string.isRequired,
  onVacationAdded: PropTypes.func.isRequired, // Ensure this prop is required
};

export default AddVacation;
