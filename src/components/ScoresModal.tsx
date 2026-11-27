import Modal from "./Modal";
import type { GameOutcome } from "../hooks/useGameTotals";

type ScoresModalProps = {
  /** The result of the game that just ended, or null when opened mid-game. */
  outcome: GameOutcome | null;
  totalWins: number;
  totalLosses: number;
  closeGameScoresModal: () => void;
};

const headings: Record<GameOutcome, string> = {
  WIN: "Game Over! You won!",
  LOSE: "Game Over! You lost!",
};

export default function ScoresModal({
  outcome,
  totalWins,
  totalLosses,
  closeGameScoresModal,
}: ScoresModalProps) {
  return (
    <Modal
      className="game-scores-modal"
      titleId="game-scores-modal-title"
      testId="game-scores-modal"
      onClose={closeGameScoresModal}
    >
      <h2 id="game-scores-modal-title">
        {outcome ? headings[outcome] : "Game Scores"}
      </h2>
      <div className="game-scores">
        <div>
          Total wins:
          <span className="player-game-score" data-testid="total-wins">
            {totalWins}
          </span>
        </div>
        <div>
          Total losses:
          <span className="computer-game-score" data-testid="total-losses">
            {totalLosses}
          </span>
        </div>
      </div>
      <button
        className="btn"
        data-testid="continue-button"
        onClick={closeGameScoresModal}
      >
        Continue
      </button>
    </Modal>
  );
}
