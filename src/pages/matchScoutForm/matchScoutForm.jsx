import { useState } from "react";
import Header from "../../components/header/header";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { submitMatchScout } from "../../api/server";
import TextBox from "../../components/textBox/textBox";
import SubmitButton from "../../components/submitBtn/submitBtn";
import "./matchScout.css";
import ScoringCounter from '../../components/scoringCounter/scoringCounter';
import Checkbox from "../../components/checkbox/checkbox";
import Dropdown from "../../components/dropdown/dropdown";
import useScrollToTop from '../../hooks/useScrollToTop';

// const CHOICEYESNOBLANK = ["-", "Yes", "No"];
const SCORING_LEVELS = ["-", "L1", "L2", "L3", "L4"];
const CHOICEYESNO = ["Yes", "No"];

const DEFAULT_STATE = {
  // Auto
  autoFuelScores: 0,
  autoFuelAttempts: 0,
  autoHumanPlayerRefuel: "No",
  autoNeutralZoneRefuel: "No",
  autoClimb: "No",

  // Teleop
  teleopFuelScores: 0,
  teleopFuelAttempts: 0,
  teleopHumanPlayerRefuelAttempts: 0,
  teleopNeutralZoneRefuelAttempts: 0,


  // Climb
  climbLevel: "None",
  climbSuccess: "No",
  climbAttemptTime: "None",
  climbComments: "",

  // General
  robotSpeed: "None",
  intakePerformance: "None",
  shooterPerformance: "None",
  // defenseRating: "-",
  generalComments: "",

  // Robot Reliability
  brokeDown: "-",              // Yes/No dropdown
  breakdownDetails: "",       // Text box for details
  completelyBroken: false,    // Checkbox for "Did not move/broken"
};


const MatchScoutForm = ({ username }) => {
  useScrollToTop();
  const { teamNumber, matchNumber } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ ...DEFAULT_STATE });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to submit? You won't be able to come back to this page.");
    if (!confirmed) return;

    setFormSubmitted(true);

    const requiredFields = { ...formState };
    delete requiredFields.climbComments;
    delete requiredFields.generalComments;
    delete requiredFields.breakdownDetails;

    // Track incomplete fields
    const incompleteFields = [];

    Object.entries(requiredFields).forEach(([key, value]) => {
      if (typeof value === 'string' && (value === "" || value === "-")) {
        incompleteFields.push(key);
      }
    });

    if (incompleteFields.length > 0) {
      toast.error(`Incomplete fields: ${incompleteFields.join(', ')}`);
      console.log('Incomplete fields:', incompleteFields);
      setFormSubmitted(false);
      return;
    }

    try {
      const response = await submitMatchScout(teamNumber, {
        ...formState,
        username,
        matchNumber,
      });

      if (response.ok) {
        // await toggleMatchButtonStatus(teamNumber, matchNumber, username);
        toast.success("Match Scout form submitted successfully");
        setFormState({ ...DEFAULT_STATE });
        navigate("/");
      } else {
        toast.error("Match Scout form submission failed");
        setFormSubmitted(false);
      }
    } catch (error) {
      toast.error("Internal Server Error");
      setFormSubmitted(false);
      console.error(error);
    }
  };

  const handleNotesScored = (name, value) => {
    const level = name.match(/L\d/)[0];
    const phase = name.includes('auto') ? 'auto' : 'teleop';

    setFormState(prevState => ({
      ...prevState,
      [name]: value,
      [`${phase}${level}Attempts`]: Math.max(value, prevState[`${phase}${level}Attempts`])
    }));
  };

  const handleSingleOptionSelect = (field, option, value) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: value ? option : "None"
    }));
  };

  const handleDropdownSelect = (value, field) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleScoreIncrement = (type) => {
    setFormState((prev) => ({
      ...prev,
      [type + "Scores"]: prev[type + "Scores"] + 1,
      [type + "Attempts"]: prev[type + "Attempts"] + 1  // Always increment attempts with scores
    }));
  };

  const handleScoreDecrement = (type) => {
    setFormState((prev) => {
      if (prev[type + "Scores"] <= 0) return prev;
      return {
        ...prev,
        [type + "Scores"]: prev[type + "Scores"] - 1
      };
    });
  };

  const handleAttemptIncrement = (type) => {
    setFormState((prev) => ({
      ...prev,
      [type + "Attempts"]: prev[type + "Attempts"] + 1
    }));
  };

  const handleAttemptDecrement = (type) => {
    setFormState((prev) => {
      if (prev[type + "Attempts"] <= prev[type + "Scores"]) return prev;
      return {
        ...prev,
        [type + "Attempts"]: prev[type + "Attempts"] - 1
      };
    });
  };

  const handleCheckboxChange = (name) => {
    setFormState((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div>
      <Header
        toWhere="/matchscout-team-choice"
        headerText={
          <>
            <span style={{ color: "#FFFFFF" }}>Match Scout</span>
          </>
        }
      />
      <form onSubmit={handleSubmit} className="match-scout">
        {/* Auto Scoring Section */}
        <div className="scout-section">
          <h2>Auto Period</h2>

          {/* Auto Fuel Scoring */}
          <div className="scoring-subsection">
            <h3>Fuel Scoring</h3>
            <div className="counter-group">
              <div className="scoring-label">Fuel</div>
              <ScoringCounter
                scoredValue={formState.autoFuelScores}
                attemptedValue={formState.autoFuelAttempts}
                onScoredChange={(value) =>
                  setFormState(prevState => ({
                    ...prevState,
                    autoFuelScores: value,
                    autoFuelAttempts: Math.max(value, prevState.autoFuelAttempts)
                  }))
                }
                onAttemptedChange={(value) =>
                  setFormState(prevState => ({
                    ...prevState,
                    autoFuelAttempts: Math.max(value, prevState.autoFuelScores)
                  }))
                }
              />
            </div>
          </div>

          {/* Human Player Refuel */}
          <div className="checkbox-group">
            <h3>Human Player Refuel</h3>
            <div className="checkbox-row">
              <Checkbox
                label="Human Player Refueled?"
                checked={formState.autoHumanPlayerRefuel === "Yes"}
                onChange={(checked) =>
                  setFormState(prevState => ({
                    ...prevState,
                    autoHumanPlayerRefuel: checked ? "Yes" : "No"
                  }))
                }
              />
            </div>
          </div>

          {/* Neutral Zone Refuel */}
          <div className="checkbox-group">
            <h3>Neutral Zone Refuel</h3>
            <div className="checkbox-row">
              <Checkbox
                label="Neutral Zone Refueled?"
                checked={formState.autoNeutralZoneRefuel === "Yes"}
                onChange={(checked) =>
                  setFormState(prevState => ({
                    ...prevState,
                    autoNeutralZoneRefuel: checked ? "Yes" : "No"
                  }))
                }
              />
            </div>
          </div>

          {/* Auto Climb */}
          <div className="checkbox-group">
            <h3>Auto Climb</h3>
            <div className="checkbox-row">
              <Checkbox
                label="Climbed in Auto?"
                checked={formState.autoClimb === "Yes"}
                onChange={(checked) =>
                  setFormState(prevState => ({
                    ...prevState,
                    autoClimb: checked ? "Yes" : "No"
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Teleop Scoring Section */}
        <div className="scout-section">
          <h2>Teleop Period - Scoring</h2>

          {/* Teleop Fuel Scoring */}
          <div className="scoring-subsection">
            <h3>Fuel Scoring</h3>
            <div className="counter-group">
              <div className="scoring-label">Fuel</div>
              <ScoringCounter
                scoredValue={formState.teleopFuelScores}
                attemptedValue={formState.teleopFuelAttempts}
                onScoredChange={(value) =>
                  setFormState(prevState => ({
                    ...prevState,
                    teleopFuelScores: value,
                    teleopFuelAttempts: Math.max(value, prevState.teleopFuelAttempts)
                  }))
                }
                onAttemptedChange={(value) =>
                  setFormState(prevState => ({
                    ...prevState,
                    teleopFuelAttempts: Math.max(value, prevState.teleopFuelScores)
                  }))
                }
              />
            </div>
          </div>

          {/* Human Player Refuel Attempts */}
          <div className="scoring-subsection">
            <h3>Human Player Refuel Attempts</h3>
            <div className="counter-group">
              <div className="scoring-label">Attempts</div>
              <ScoringCounter
                scoredValue={formState.teleopHumanPlayerRefuelAttempts}
                attemptedValue={formState.teleopHumanPlayerRefuelAttempts}
                onScoredChange={(value) =>
                  setFormState(prevState => ({
                    ...prevState,
                    teleopHumanPlayerRefuelAttempts: value
                  }))
                }
                onAttemptedChange={(value) =>
                  setFormState(prevState => ({
                    ...prevState,
                    teleopHumanPlayerRefuelAttempts: value
                  }))
                }
              />
            </div>
          </div>
          {/* Neutral Zone Refuel */}
          <div className="scoring-subsection">
            <h3>Neutral Zone Refuel</h3>
            <div className="counter-group">
              <div className="scoring-label">Attempts</div>
              <ScoringCounter
                scoredValue={formState.teleopNeutralZoneRefuelAttempts}
                attemptedValue={formState.teleopNeutralZoneRefuelAttempts}
                onScoredChange={(value) =>
                  setFormState(prevState => ({
                    ...prevState,
                    teleopNeutralZoneRefuelAttempts: value
                  }))
                }
                onAttemptedChange={(value) =>
                  setFormState(prevState => ({
                    ...prevState,
                    teleopNeutralZoneRefuelAttempts: value
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Climb Section */}
        <div className="scout-section">
          <h2>Climb</h2>
          <div className="climb-section">
            <div className="climb-options">
              <div className="checkbox-group">
                <h3>Climb Level Attempted</h3>
                <div className="checkbox-row">
                  <Checkbox
                    label="L1"
                    checked={formState.climbLevel === "L1"}
                    onChange={(checked) => handleSingleOptionSelect('climbLevel', "L1", checked)}
                  />
                  <Checkbox
                    label="L2"
                    checked={formState.climbLevel === "L2"}
                    onChange={(checked) => handleSingleOptionSelect('climbLevel', "L2", checked)}
                  />
                  <Checkbox
                    label="L3"
                    checked={formState.climbLevel === "L3"}
                    onChange={(checked) => handleSingleOptionSelect('climbLevel', "L3", checked)}
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <h3>Climb Success</h3>
                <div className="checkbox-row">
                  <Checkbox
                    label="Successful Climb?"
                    checked={formState.climbSuccess === "Yes"}
                    onChange={(checked) =>
                      setFormState(prevState => ({
                        ...prevState,
                        climbSuccess: checked ? "Yes" : "No"
                      }))
                    }
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <h3>Climb Attempt Timing</h3>
                <div className="checkbox-row">
                  <Checkbox
                    label="Early (>30s)"
                    checked={formState.climbAttemptTime === "Early (>30s)"}
                    onChange={(checked) => handleSingleOptionSelect('climbAttemptTime', "Early (>30s)", checked)}
                  />
                  <Checkbox
                    label="Mid (15-30s)"
                    checked={formState.climbAttemptTime === "Mid (15-30s)"}
                    onChange={(checked) => handleSingleOptionSelect('climbAttemptTime', "Mid (15-30s)", checked)}
                  />
                  <Checkbox
                    label="Late (<15s)"
                    checked={formState.climbAttemptTime === "Late (<15s)"}
                    onChange={(checked) => handleSingleOptionSelect('climbAttemptTime', "Late (<15s)", checked)}
                  />
                </div>
              </div>
            </div>

            <div className="comments-section">
              <TextBox
                label="Climb Comments"
                name="climbComments"
                value={formState.climbComments}
                onChange={(e) => setFormState({ ...formState, climbComments: e.target.value })}
                placeholder="Add any additional comments about the climb..."
              />
            </div>
          </div>
        </div>

        {/* Robot Performance Section */}
        <div className="scout-section">
          <h2>Robot Performance</h2>
          <div className="checkbox-group">
            <h3>Robot Speed</h3>
            <Checkbox
              label="Slow"
              checked={formState.robotSpeed === "Slow"}
              onChange={(checked) => handleSingleOptionSelect('robotSpeed', "Slow", checked)}
            />
            <Checkbox
              label="Medium"
              checked={formState.robotSpeed === "Medium"}
              onChange={(checked) => handleSingleOptionSelect('robotSpeed', "Medium", checked)}
            />
            <Checkbox
              label="Fast"
              checked={formState.robotSpeed === "Fast"}
              onChange={(checked) => handleSingleOptionSelect('robotSpeed', "Fast", checked)}
            />
          </div>
          {/* <Dropdown
            label="Defense Rating"
            options={["-", "No Defense", "1", "2", "3", "4", "5"]}
            onSelect={(value) => setFormState({ ...formState, defenseRating: value })}
            defaultOption={formState.defenseRating}
          /> */}
          <div className="checkbox-group">
            <h3>Intake Performance</h3>
            <div className="checkbox-row">
              <Checkbox
                label="Good"
                checked={formState.intakePerformance === "Good"}
                onChange={(checked) => handleSingleOptionSelect('intakePerformance', "Good", checked)}
              />
              <Checkbox
                label="Okay"
                checked={formState.intakePerformance === "Okay"}
                onChange={(checked) => handleSingleOptionSelect('intakePerformance', "Okay", checked)}
              />
              <Checkbox
                label="Bad"
                checked={formState.intakePerformance === "Bad"}
                onChange={(checked) => handleSingleOptionSelect('intakePerformance', "Bad", checked)}
              />
            </div>
          </div>
          <div className="checkbox-group">
            <h3>Shooter Performance</h3>
            <div className="checkbox-row">
              <Checkbox
                label="Good"
                checked={formState.shooterPerformance === "Good"}
                onChange={(checked) => handleSingleOptionSelect('shooterPerformance', "Good", checked)}
              />
              <Checkbox
                label="Okay"
                checked={formState.shooterPerformance === "Okay"}
                onChange={(checked) => handleSingleOptionSelect('shooterPerformance', "Okay", checked)}
              />
              <Checkbox
                label="Bad"
                checked={formState.shooterPerformance === "Bad"}
                onChange={(checked) => handleSingleOptionSelect('shooterPerformance', "Bad", checked)}
              />
            </div>
          </div>
          <TextBox
            label="General Comments"
            name="generalComments"
            value={formState.generalComments}
            onChange={(e) => setFormState({ ...formState, generalComments: e.target.value })}
          />
        </div>

        <div className="scout-section">
          <h2>Robot Reliability</h2>
          <div className="form-section">
            <Dropdown
              label="Did the robot break down during this match?"
              options={CHOICEYESNO}
              onSelect={(value) => handleDropdownSelect(value, "brokeDown")}
              defaultOption={formState.brokeDown}
            />

            {formState.brokeDown === "Yes" && (
              <div className="comments-section">
                <TextBox
                  label="What happened? (Breakdown details)"
                  name="breakdownDetails"
                  value={formState.breakdownDetails}
                  onChange={handleChange}
                  placeholder="Describe what broke..."
                />
              </div>
            )}

            <div className="checkbox-group">
              <Checkbox
                label="Did not move entire match / completely broken"
                checked={formState.completelyBroken}
                onChange={() => handleCheckboxChange('completelyBroken')}
              />
            </div>
          </div>
        </div>

        <SubmitButton label={formSubmitted ? "Submitting..." : "Submit"} />
      </form>
    </div>
  );
};

export default MatchScoutForm; 