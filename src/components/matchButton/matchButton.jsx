import { useNavigate } from "react-router-dom";
import "./matchButton.css";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Button = ({
  teamNumber,
  matchNumber,
  className,
  username,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [status, setStatus] = useState("available");
  // const [scoutedBy, setScoutedBy] = useState(null);
  const navigate = useNavigate();

  // const checkStatus = async () => {
  //   try {
  //     const response = await getMatchButtonStatus(teamNumber, matchNumber);
  //     if (response.status === 200) {
  //       if (response.data.status === "working") {
  //         setStatus(response.data.status);
  //         setScoutedBy(response.data.scoutedBy);
  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("CHECK STATUS ERROR:", error);
  //   }
  // };

  // useEffect(() => {
  //   setIsLoading(true);
  //   checkStatus().finally(() => {
  //     setIsLoading(false);
  //   });
  // }, []);

  // const handleTeamButtonClick = async () => {
  //   if (!username) {
  //     toast.error("Please log in first");
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     const toggleResponse = await toggleMatchButtonStatus(
  //       teamNumber,
  //       matchNumber,
  //       username
  //     );
  //     if (toggleResponse.status === 200) {
  //       setStatus(toggleResponse.data.status);
  //       setScoutedBy(toggleResponse.data.scoutedBy);
  //       onButtonClick(
  //         teamNumber,
  //         toggleResponse.data.status,
  //         toggleResponse.data.scoutedBy
  //       );
  //       if (toggleResponse.data.status === "working") {
  //         navigate(`/matchscout-team-form/${teamNumber}/${matchNumber}`);
  //       }
  //     } else {
  //       console.error("ERROR WHILE TOGGLING BUTTON: " + toggleResponse.data);
  //     }
  //   } catch (error) {
  //     console.error("Toggle error:", error);
  //     toast.error("Error updating match status");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleTeamButtonClick = async () => {
    if (!username) {
      toast.error("Please log in first");
      return;
    }
    setIsLoading(true);
    try {
        navigate(`/matchscout-team-form/${teamNumber}/${matchNumber}`);
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Error updating match status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={`team-button ${className} ${isLoading ? 'loading' : ''}`}
      disabled={isLoading}
      onClick={handleTeamButtonClick}
    >
      {isLoading ? (
        <div className="button-spinner"></div>
      ) : (
        <>
          <span className="team-number">#{teamNumber}</span>
          {/* <div className="scout-status">
            <span className="status-dot"></span>
            {status === "working" ? (
              <span>Scouting: {scoutedBy || "Unknown"}</span>
            ) : (
              "Not Scouted"
            )}
          </div> */}
        </>
      )}
    </button>
  );
};

const MatchButton = ({ teamNums, matchNum, username }) => {
  return (
    <div className="match-card">
      <div className="alliance-row red-alliance">
        {teamNums.slice(0, 3).map((num) => (
          <Button
            key={num}
            teamNumber={num}
            matchNumber={matchNum}
            className="red"
            username={username}
            onButtonClick={() => {}}
          />
        ))}
      </div>

      <div className="alliance-divider">
        <span>VS</span>
      </div>

      <div className="alliance-row blue-alliance">
        {teamNums.slice(3).map((num) => (
          <Button
            key={num}
            teamNumber={num}
            matchNumber={matchNum}
            className="blue"
            username={username}
            onButtonClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchButton;
