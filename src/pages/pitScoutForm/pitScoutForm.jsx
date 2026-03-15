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
  scoringPositions: {       // Auto Scoring Positions (Checkboxes)
    processor: false,
    net: false,
    l1: false,
    l2: false,
    l3: false,
    l4: false,
  },
  scoringPositionsTeleop: {  // Teleop Scoring Positions (Checkboxes)
    processorTeleop: false,
    netTeleop: false,
    l1Teleop: false,
    l2Teleop: false,
    l3Teleop: false,
    l4Teleop: false,
  },
  autoNotesScored: "",      // Auto Capabilities

  cycleTimeHumanPlayer: "", // Teleop Capabilities
  cycleTimeNeutralZone: "", // Teleop Capabilities
  maxFuelPickup: "",        // Teleop Capabilities

  climb: "",                // Climb Capabilities
  autoClimb: "",           // Climb Capabilities
  reachableClimb: "",      // Climb Capabilities

  bumpOrTrench: "",         // Robot Navigation

  shooterType: "",          // Shooter Information
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
      .filter(([key, value]) => 
        key !== "additionalComments" && 
        key !== "scoringPositions" && 
        key !== "scoringPositionsTeleop"
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
      console.log(error);
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
        <TextInput
          label="Robot Weight (lbs)"
          name="robotWeight"
          value={formState.robotWeight}
          onChange={handleChange}
        />

        <TextInput
          label="Frame Size (length x width in inches)"
          name="frameSize"
          value={formState.frameSize}
          onChange={handleChange}
        />

        <Dropdown
          label="Drivetrain"
          options={[
            "-",
            "Swerve Drive",
            "Westcoast/Tank drive",
            "Omni",
            "Mecanum",
          ]}
          onSelect={(value) => handleDropdownSelect(value, "drivetrain")}
          defaultOption={formState.drivetrain}
        />

        <Dropdown
          label="Can do auto?"
          options={CHOICEYESNO}
          onSelect={(value) => handleDropdownSelect(value, "auto")}
          defaultOption={formState.auto}
        />



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
              label="Processor"
              checked={formState.scoringPositions.processor}
              onChange={() => handleAutoCheckboxChange('processor')}
            />
            <Checkbox
              label="Net"
              checked={formState.scoringPositions.net}
              onChange={() => handleAutoCheckboxChange('net')}
            />
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
            <Checkbox
              label="L4"
              checked={formState.scoringPositions.l4}
              onChange={() => handleAutoCheckboxChange('l4')}
            />
          </div>
        </div>
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

        <Dropdown
          label="Can climb?"
          options={CHOICEYESNO}
          onSelect={(value) => handleDropdownSelect(value, "climb")}
          defaultOption={formState.climb}
        />

        <Dropdown
          label="Can do auto climb?"
          options={CHOICEYESNO}
          onSelect={(value) => handleDropdownSelect(value, "autoClimb")}
          defaultOption={formState.autoClimb}
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

        <div className="checkbox-group">
          <h3 className="checkbox-text">Scoring Positions in Teleop</h3>
          <div className="checkbox-row">
            <Checkbox
              label="Processor"
              checked={formState.scoringPositionsTeleop.processorTeleop}
              onChange={() => handleTeleopCheckboxChange('processorTeleop')}
            />
            <Checkbox
              label="Net"
              checked={formState.scoringPositionsTeleop.netTeleop}
              onChange={() => handleTeleopCheckboxChange('netTeleop')}
            />
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
          label="Shooter Type"
          name="shooterType"
          value={formState.shooterType}
          onChange={handleChange}
        />

        <TextInput
          label="Additional Comments"
          name="additionalComments"
          value={formState.additionalComments}
          onChange={handleChange}
          optional={true} // Optional field
        />
        <SubmitButton label={formSubmitted ? "Submitting..." : "Submit"} />
      </form>
    </div>
  );
};

export default PitScoutForm;
