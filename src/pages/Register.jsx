import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add useNavigate for navigation

const Register = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false); // State to check if user is admin
  const token = localStorage.getItem('token'); // Get token from localStorage
  const navigate = useNavigate(); // Initialize navigate for redirection

  // Check if the user is an admin on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('https://vacation-tracker-backend.onrender.com/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If not authorized, redirect or show error
          setError('Unauthorized access. Only admins can register new users.');
          navigate('/'); // Redirect to the home page or an appropriate route
        } else {
          const userData = await response.json();
          if (!userData.isAdmin) {
            setError('Unauthorized access. Only admins can register new users.');
            navigate('/'); // Redirect to the home page or an appropriate route
          } else {
            setIsAuthorized(true); // User is admin
          }
        }
      } catch (err) {
        setError(err);
      }
    };

    checkAdminStatus();
  }, [navigate, token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://vacation-tracker-backend.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Admin token
        },
        body: JSON.stringify({ name, position, email, phone, password, isAdmin }),
      });

      if (response.ok) {
        // Success, handle UI updates like showing success message
        setSuccessMessage('User registered successfully!');
        setError('');
        // Reset form fields
        setName('');
        setPosition('');
        setEmail('');
        setPhone('');
        setPassword('');
        setIsAdmin(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register user');
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold text-[#837CD8] mb-4">Register New User</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {isAuthorized && ( // Only show form if authorized
        <form onSubmit={handleRegister} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Position</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Admin</label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            /> Is Admin
          </div>

          <button
            type="submit"
            className="w-full bg-[#837CD8] text-white p-2 rounded hover:bg-[#6252B0]"
          >
            Register User
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
