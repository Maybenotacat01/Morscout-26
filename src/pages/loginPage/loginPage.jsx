import "./loginPage.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Autocomplete from "../../components/autocomplete/autocomplete";
import { teamMembers } from "../../data/teamMembers";

const LoginPage = ({ changeUsername }) => {
  const navigate = useNavigate();

  const handleSelect = (selectedName) => {
    if (selectedName) {
      changeUsername(selectedName);
      navigate("/");
    }
  };

  return (
    <div className="login">
      <div className="login-brand">
        <div className="login-brand-title">
          Mor<span>Scout</span>
        </div>
        <div className="login-brand-sub">MorTorq Robotics · Team 1515</div>
      </div>

      <form className="login-form">
        <div className="login-form-header">
          <div className="login-label">Select Your Name</div>
          <div className="login-label-sub">Choose your name to begin scouting</div>
        </div>
        <Autocomplete
          options={teamMembers}
          onSelect={handleSelect}
          placeholder="Type your name..."
        />
      </form>
    </div>
  );
};

LoginPage.propTypes = {
  changeUsername: PropTypes.func,
};

export default LoginPage;
