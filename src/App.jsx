import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Profile from './components/Profile';
import Layout from './components/Layout'; // Import the Layout

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route without the layout (no Sidebar) */}
        <Route path="/" element={<LoginPage />} />

        {/* Routes with the layout (Sidebar included) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
