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

const CHOICEYESNO = ["-", "Yes", "No"];

const DEFAULT_STATE = {
  // Auto
  autoFuelScores: 0,
  autoFuelComments: "",
  autoHumanPlayerRefuel: "No",
  autoNeutralZoneRefuel: "No",
  autoClimb: "No",
  autoComments: "",

  // Teleop
  teleopFuelScores: 0,
  teleopFuelComments: "",
  teleopHumanPlayerRefuelScores: 0,
  teleopNeutralZoneRefuelScores: 0,
  teleopSendingFromNeutralZone: "-",
  teleopComments: "",


  // Climb
  climbLevel: "None",
  climbSuccess: "-",
  climbAttemptTime: "None",
  climbComments: "",

  // General
  robotSpeed: "None",
  intakePerformance: "None",
  shooterAccuracy: "None",
  // defenseRating: "-",
  generalComments: "",

  // Robot Reliability
  matchConsistency: "-",       // Match Consistency dropdown
  brokeDown: "-",              // Yes/No dropdown
  breakdownDetails: "",       // Text box for details
  completelyBroken: false,    // Checkbox for "Did not move/broken"
  reliabilityComments: "",    // Reliability Comments
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
    delete requiredFields.autoComments;
    delete requiredFields.autoFuelComments;
    delete requiredFields.autoFuelScores;
    delete requiredFields.teleopComments;
    delete requiredFields.teleopFuelComments;
    delete requiredFields.teleopFuelScores;
    delete requiredFields.reliabilityComments;

    // Track incomplete fields
    const incompleteFields = [];

    Object.entries(requiredFields).forEach(([key, value]) => {
      if (typeof value === 'string' && (value === "" || value === "-")) {
        incompleteFields.push(key);
      }
    });

    if (incompleteFields.length > 0) {
      toast.error(`Incomplete fields: ${incompleteFields.join(', ')}`);
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

  const handleScoreChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
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
            <h3>Fuel Scoring (Rough Estimate)</h3>
            <input
              className="number-input"
              type="number"
              min="0"
              name="autoFuelScores"
              value={formState.autoFuelScores}
              onChange={handleChange}
              placeholder="0"
            />
            <TextBox
              label="Fuel Scoring Comments"
              name="autoFuelComments"
              value={formState.autoFuelComments}
              onChange={handleChange}
              placeholder="Any notes on fuel scoring..."
            />
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

          <div className="comments-section">
            <TextBox
              label="Auto Comments"
              name="autoComments"
              value={formState.autoComments}
              onChange={handleChange}
              placeholder="Any comments about auto period..."
            />
          </div>
        </div>

        {/* Teleop Scoring Section */}
        <div className="scout-section">
          <h2>Teleop Period - Scoring</h2>

          {/* Teleop Fuel Scoring */}
          <div className="scoring-subsection">
            <h3>Fuel Scoring (Rough Estimate)</h3>
            <input
              className="number-input"
              type="number"
              min="0"
              name="teleopFuelScores"
              value={formState.teleopFuelScores}
              onChange={handleChange}
              placeholder="0"
            />
            <TextBox
              label="Fuel Scoring Comments"
              name="teleopFuelComments"
              value={formState.teleopFuelComments}
              onChange={handleChange}
              placeholder="Any notes on fuel scoring..."
            />
          </div>

          {/* Human Player Refuel */}
          <div className="scoring-subsection">
            <h3>Human Player Refuel</h3>
            <div className="counter-group">
              <ScoringCounter
                scoredValue={formState.teleopHumanPlayerRefuelScores}
                onScoredChange={(value) => handleScoreChange('teleopHumanPlayerRefuelScores', value)}
              />
            </div>
          </div>

          {/* Neutral Zone Refuel */}
          <div className="scoring-subsection">
            <h3>Neutral Zone Refuel</h3>
            <div className="counter-group">
              <ScoringCounter
                scoredValue={formState.teleopNeutralZoneRefuelScores}
                onScoredChange={(value) => handleScoreChange('teleopNeutralZoneRefuelScores', value)}
              />
            </div>
          </div>

          <Dropdown
            label="Was the robot sending balls from the neutral zone?"
            options={["-", "Yes", "No"]}
            onSelect={(value) => handleDropdownSelect(value, "teleopSendingFromNeutralZone")}
            defaultOption={formState.teleopSendingFromNeutralZone}
          />

          <div className="comments-section">
            <TextBox
              label="Teleop Comments"
              name="teleopComments"
              value={formState.teleopComments}
              onChange={handleChange}
              placeholder="Any comments about teleop period..."
            />
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

              <Dropdown
                label="Climb Success"
                options={CHOICEYESNO}
                onSelect={(value) => handleDropdownSelect(value, 'climbSuccess')}
                defaultOption={formState.climbSuccess}
              />

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
            <div className="checkbox-row">
              <Checkbox
                label="Fast"
                checked={formState.robotSpeed === "Fast"}
                onChange={(checked) => handleSingleOptionSelect('robotSpeed', "Fast", checked)}
              />
              <Checkbox
                label="Medium"
                checked={formState.robotSpeed === "Medium"}
                onChange={(checked) => handleSingleOptionSelect('robotSpeed', "Medium", checked)}
              />
              <Checkbox
                label="Slow"
                checked={formState.robotSpeed === "Slow"}
                onChange={(checked) => handleSingleOptionSelect('robotSpeed', "Slow", checked)}
              />
            </div>
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
            <h3>Shooter Accuracy</h3>
            <div className="checkbox-row">
              <Checkbox
                label="Good"
                checked={formState.shooterAccuracy === "Good"}
                onChange={(checked) => handleSingleOptionSelect('shooterAccuracy', "Good", checked)}
              />
              <Checkbox
                label="Okay"
                checked={formState.shooterAccuracy === "Okay"}
                onChange={(checked) => handleSingleOptionSelect('shooterAccuracy', "Okay", checked)}
              />
              <Checkbox
                label="Bad"
                checked={formState.shooterAccuracy === "Bad"}
                onChange={(checked) => handleSingleOptionSelect('shooterAccuracy', "Bad", checked)}
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
              label="Match Consistency (Did performance increase or decrease over the match?)"
              options={["-", "Increased", "Decreased"]}
              onSelect={(value) => handleDropdownSelect(value, "matchConsistency")}
              defaultOption={formState.matchConsistency}
            />

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
              <div className="checkbox-row">
                <Checkbox
                  label="Did not move entire match / completely broken"
                  checked={formState.completelyBroken}
                  onChange={(checked) => setFormState(prev => ({ ...prev, completelyBroken: checked }))}
                />
              </div>
            </div>

            <div className="comments-section">
              <TextBox
                label="Reliability Comments"
                name="reliabilityComments"
                value={formState.reliabilityComments}
                onChange={handleChange}
                placeholder="Any comments about robot reliability..."
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