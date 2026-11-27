import Modal from "./Modal";
import { CHOICES, SELECTIONS, losesTo } from "../utils/choices";
import { WINNING_SCORE } from "../utils/gameLogic";

type RulesModalProps = {
  showRulesModal: boolean;
  closeRulesModal: () => void;
};

export default function RulesModal({
  showRulesModal,
  closeRulesModal,
}: RulesModalProps) {
  if (!showRulesModal) return null;

  return (
    <Modal
      className="rules-modal"
      titleId="rules-modal-title"
      testId="rules-modal"
      onClose={closeRulesModal}
    >
      <h2 id="rules-modal-title">How it works (rules)</h2>
      <div className="rules">
        <ul className="rules-list">
          {SELECTIONS.map((selection) => {
            const { label, symbol, beats } = CHOICES[selection];
            const [first, second] = losesTo(selection);
            return (
              <li key={selection}>
                <span className="icon" aria-hidden="true">
                  {symbol}
                </span>
                {label} beats {beats[0]} and {beats[1]} but loses to {first}{" "}
                and {second}.
              </li>
            );
          })}
        </ul>
        <img
          src={`${import.meta.env.BASE_URL}images/rules.png`}
          className="modal-image"
          alt="Diagram of the Rock Paper Scissors Lizard Spock rules"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <div className="rules-text">
        <p>The winner of a game is the first to win {WINNING_SCORE} rounds.</p>
      </div>
      <button className="btn" onClick={closeRulesModal}>
        Play game
      </button>
    </Modal>
  );
}
