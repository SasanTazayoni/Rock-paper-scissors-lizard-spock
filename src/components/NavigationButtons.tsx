import type { MouseEvent } from "react";

type NavigationButtonsProps = {
  resetGame: () => void;
  resetTotals: () => void;
  openRulesModal: () => void;
  openGameScoresModal: () => void;
};

export default function NavigationButtons({
  resetGame,
  resetTotals,
  openRulesModal,
  openGameScoresModal,
}: NavigationButtonsProps) {
  const handleRippleEffect = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const x = e.clientX - target.offsetLeft;
    const y = e.clientY - target.offsetTop;

    const ripple = document.createElement("span");
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    target.appendChild(ripple);

    setTimeout(() => ripple.remove(), 500);
  };

  const handleResetClick = () => {
    resetGame();
    resetTotals();
  };

  return (
    <nav className="btns">
      <button
        className="btn--reset"
        aria-label="Reset Button"
        data-reset-btn
        onClick={handleResetClick}
        onMouseDown={handleRippleEffect}
      >
        Reset
      </button>

      <div className="btn-container">
        <button
          className="btn--dark"
          aria-label="See Rules Button"
          data-rules-btn
          onClick={openRulesModal}
        >
          See rules
        </button>

        <button
          className="btn--dark"
          aria-label="Game Scores Button"
          data-game-scores-btn
          onClick={openGameScoresModal}
        >
          Wins & losses
        </button>
      </div>
    </nav>
  );
}
