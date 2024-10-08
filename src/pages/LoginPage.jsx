import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://vacation-tracker-backend.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', data.user.isAdmin); // Store admin status
        navigate('/dashboard'); // Redirect to dashboard page if login is successful
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Display error message if login fails
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl">
        {/* Login Form */}
        <div className="lg:w-1/2 w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#837CD8] text-white py-2 rounded-lg hover:bg-[#7262C9] transition-colors"
            >
              Login
            </button>
          </form>
        </div>

        {/* Test Account Info */}
        <div className="lg:w-1/2 w-full bg-gray-100 p-8 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Test App Credentials</h3>
          <p className="mb-2">
            <strong>Admin Account:</strong><br />
            Email: <span className="font-mono">admin@example.com</span><br />
            Password: <span className="font-mono">admin</span>
          </p>
          <p className="mb-2">
            <strong>User Account:</strong><br />
            Email: <span className="font-mono">user@example.com</span><br />
            Password: <span className="font-mono">user</span>
          </p>
          <p className="text-gray-600">
            Use the above credentials to log in and test the application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
