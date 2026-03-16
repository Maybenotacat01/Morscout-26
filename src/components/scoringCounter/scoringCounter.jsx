import "./scoringCounter.css";

const ScoringCounter = ({ scoredValue, onScoredChange }) => {
  return (
    <div className="scoring-counter">
      <div className="scoring-controls">
        <button
          type="button"
          onClick={() => onScoredChange(Math.max(0, scoredValue - 1))}
        >
          -
        </button>
        <span className="scoring-value">{scoredValue}</span>
        <button
          type="button"
          onClick={() => onScoredChange(scoredValue + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ScoringCounter;
