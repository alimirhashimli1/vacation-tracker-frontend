// src/components/Error.jsx
import PropTypes from "prop-types"

const Error = ({ message }) => {
  return (
    <div className="text-red-500 mb-4">
      {message && <p>{message}</p>}
    </div>
  );
};

export default Error;

Error.propTypes = {
    message: PropTypes.string,
  };