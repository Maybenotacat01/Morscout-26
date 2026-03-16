import { useState } from "react";
import TextInput from "../../components/textInput/textInput";
import SubmitButton from "../../components/submitBtn/submitBtn";
import Header from "../../components/header/header";
import Dropdown from "../../components/dropdown/dropdown";
import TextBox from "../../components/textBox/textBox";
import Checkbox from "../../components/checkbox/checkbox";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { submitPitscout } from "../../api/server";
import "./pitScoutForm.css";
import useScrollToTop from '../../hooks/useScrollToTop';

const CHOICEYESNO = ["-", "Yes", "No"]; // Blank added for default

const DEFAULT_STATE = {
  robotWeight: "",           // Robot Specifications
  frameSize: "",            // Robot Specifications
  drivetrain: "",           // Robot Specifications

  auto: "",                 // Auto Capabilities
  autoType: {               // Auto Type (Checkboxes)
    shoot: false,
    climb: false,
  },
  scoringPositions: {       // Auto Scoring Positions (Checkboxes)
    l1: false,
    l2: false,
    l3: false,
  },
  scoringPositionsTeleop: {  // Teleop Scoring Positions (Checkboxes)
    l1Teleop: false,
    l2Teleop: false,
    l3Teleop: false,
    l4Teleop: false,
  },
  swerveType: "",           // Swerve Type
  robotSpecsComments: "",   // Robot Specs Comments

  autoNotesScored: "",      // Auto Capabilities

  cycleTimeHumanPlayer: "", // Teleop Capabilities
  cycleTimeNeutralZone: "", // Teleop Capabilities
  maxFuelPickup: "",        // Teleop Capabilities
  teleopComments: "",       // Teleop Comments

  climb: "",                // Climb Capabilities
  reachableClimb: "",      // Climb Capabilities

  bumpOrTrench: "",         // Robot Navigation

  shooterType: "",          // Shooter Information
  shooterComments: "",      // Shooter Comments
  additionalComments: "",   // Additional Information
};

const PitScoutForm = ({ username }) => {
  const { teamNumber } = useParams();
  const navigate = useNavigate();
  useScrollToTop();

  const [formState, setFormState] = useState({ ...DEFAULT_STATE, teamNumber });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDropdownSelect = (selectedValue, name) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: selectedValue,
    }));
  };

  const handleAutoTypeCheckboxChange = (type) => {
    setFormState((prevState) => ({
      ...prevState,
      autoType: {
        ...prevState.autoType,
        [type]: !prevState.autoType[type]
      }
    }));
  };

  const handleAutoCheckboxChange = (position) => {
    setFormState((prevState) => ({
      ...prevState,
      scoringPositions: {
        ...prevState.scoringPositions,
        [position]: !prevState.scoringPositions[position]
      }
    }));
  };

  const handleTeleopCheckboxChange = (position) => {
    setFormState((prevState) => ({
      ...prevState,
      scoringPositionsTeleop: {
        ...prevState.scoringPositionsTeleop,
        [position]: !prevState.scoringPositionsTeleop[position]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Exclude optional fields from validation
    const requiredFields = Object.entries(formState)
      .filter(([key]) =>
        key !== "additionalComments" &&
        key !== "scoringPositions" &&
        key !== "scoringPositionsTeleop" &&
        key !== "swerveType" &&
        key !== "robotSpecsComments" &&
        key !== "teleopComments" &&
        key !== "shooterComments"
      )
      .some(([key, value]) => value === "");

    if (requiredFields) {
      toast.error("Form is not filled out completely");
      setFormSubmitted(false);
      return;
    }

    try {
      const response = await submitPitscout(teamNumber, {
        ...formState,
        username,
      });
      if (response.ok) {
        toast.success("Pit form submitted successfully");
        setFormState({ ...DEFAULT_STATE, teamNumber });
        navigate("/");
      } else {
        toast.error("Pit form submission failed");
        setFormSubmitted(false);
      }
    } catch (error) {
      toast.error("Internal Server Error");
      setFormSubmitted(false);
      console.error(error);
    }
  };

  return (
    <div className="pit">
      <Header
        toWhere={"/pit-team-choice"}
        headerText={
          <>
            <span style={{ color: "#FF7F23" }}>Pit </span>
            <span style={{ color: "#FFFFFF" }}>Scout</span>
          </>
        }
      />
      <form onSubmit={handleSubmit} className="pit-form">

        {/* Robot Specs */}
        <div className="pit-section">
          <h2>Robot Specs</h2>
          <TextInput
            label="Robot Weight (lbs)"
            name="robotWeight"
            value={formState.robotWeight}
            onChange={handleChange}
            type="number"
          />
          <TextInput
            label="Frame Size (length x width in inches)"
            name="frameSize"
            value={formState.frameSize}
            onChange={handleChange}
          />
          <Dropdown
            label="Drivetrain"
            options={["-", "Swerve Drive", "Westcoast/Tank drive", "Omni", "Mecanum"]}
            onSelect={(value) => handleDropdownSelect(value, "drivetrain")}
            defaultOption={formState.drivetrain}
          />
          <TextBox
            label="Swerve Type"
            name="swerveType"
            value={formState.swerveType}
            onChange={handleChange}
          />
          <TextBox
            label="Robot Specs Comments"
            name="robotSpecsComments"
            value={formState.robotSpecsComments}
            onChange={handleChange}
          />
          <TextInput
            label="Estimated Cycle Time - Human Player Station (s)"
            name="cycleTimeHumanPlayer"
            value={formState.cycleTimeHumanPlayer}
            onChange={handleChange}
          />
          <TextInput
            label="Estimated Cycle Time - Neutral Zone (s)"
            name="cycleTimeNeutralZone"
            value={formState.cycleTimeNeutralZone}
            onChange={handleChange}
          />
          <TextInput
            label="Maximum Fuel Pickup"
            name="maxFuelPickup"
            value={formState.maxFuelPickup}
            onChange={handleChange}
          />
          <TextBox
            label="Shooter Type"
            name="shooterType"
            value={formState.shooterType}
            onChange={handleChange}
          />
          <TextBox
            label="Shooter Comments"
            name="shooterComments"
            value={formState.shooterComments}
            onChange={handleChange}
          />
        </div>

        {/* Auto */}
        <div className="pit-section">
          <h2>Auto</h2>
          <Dropdown
            label="Can do auto?"
            options={CHOICEYESNO}
            onSelect={(value) => handleDropdownSelect(value, "auto")}
            defaultOption={formState.auto}
          />
          <div className="checkbox-group">
            <h3 className="checkbox-text">Auto Type</h3>
            <div className="checkbox-row">
              <Checkbox
                label="Shoot"
                checked={formState.autoType.shoot}
                onChange={() => handleAutoTypeCheckboxChange('shoot')}
              />
              <Checkbox
                label="Climb"
                checked={formState.autoType.climb}
                onChange={() => handleAutoTypeCheckboxChange('climb')}
              />
            </div>
          </div>
          <TextBox
            label="Possible auto sequences (how many can they score - list all please!)"
            name="autoNotesScored"
            value={formState.autoNotesScored}
            onChange={handleChange}
          />
          <div className="checkbox-group">
            <h3 className="checkbox-text">Scoring Positions in Auto</h3>
            <div className="checkbox-row">
              <Checkbox
                label="L1"
                checked={formState.scoringPositions.l1}
                onChange={() => handleAutoCheckboxChange('l1')}
              />
              <Checkbox
                label="L2"
                checked={formState.scoringPositions.l2}
                onChange={() => handleAutoCheckboxChange('l2')}
              />
              <Checkbox
                label="L3"
                checked={formState.scoringPositions.l3}
                onChange={() => handleAutoCheckboxChange('l3')}
              />
            </div>
          </div>
        </div>

        {/* Teleop */}
        <div className="pit-section">
          <h2>Teleop</h2>
          <div className="checkbox-group">
            <h3 className="checkbox-text">Scoring Positions in Teleop</h3>
            <div className="checkbox-row">
              <Checkbox
                label="L1"
                checked={formState.scoringPositionsTeleop.l1Teleop}
                onChange={() => handleTeleopCheckboxChange('l1Teleop')}
              />
              <Checkbox
                label="L2"
                checked={formState.scoringPositionsTeleop.l2Teleop}
                onChange={() => handleTeleopCheckboxChange('l2Teleop')}
              />
              <Checkbox
                label="L3"
                checked={formState.scoringPositionsTeleop.l3Teleop}
                onChange={() => handleTeleopCheckboxChange('l3Teleop')}
              />
              <Checkbox
                label="L4"
                checked={formState.scoringPositionsTeleop.l4Teleop}
                onChange={() => handleTeleopCheckboxChange('l4Teleop')}
              />
            </div>
          </div>
          <TextBox
            label="Teleop Comments"
            name="teleopComments"
            value={formState.teleopComments}
            onChange={handleChange}
          />
        </div>

        {/* Climb */}
        <div className="pit-section">
          <h2>Climb</h2>
          <Dropdown
            label="Can climb?"
            options={CHOICEYESNO}
            onSelect={(value) => handleDropdownSelect(value, "climb")}
            defaultOption={formState.climb}
          />
          <Dropdown
            label="Reachable Climb"
            options={["-", "L1", "L2", "L3"]}
            onSelect={(value) => handleDropdownSelect(value, "reachableClimb")}
            defaultOption={formState.reachableClimb}
          />
          <Dropdown
            label="Does the robot go over the bumps or under the trench?"
            options={["-", "Over the Bumps", "Under the Trench"]}
            onSelect={(value) => handleDropdownSelect(value, "bumpOrTrench")}
            defaultOption={formState.bumpOrTrench}
          />
        </div>

        {/* Additional */}
        <div className="pit-section">
          <h2>Additional</h2>
          <TextInput
            label="Additional Comments"
            name="additionalComments"
            value={formState.additionalComments}
            onChange={handleChange}
            optional={true}
          />
        </div>

        <SubmitButton label={formSubmitted ? "Submitting..." : "Submit"} />
      </form>
    </div>
  );
};

export default PitScoutForm;
