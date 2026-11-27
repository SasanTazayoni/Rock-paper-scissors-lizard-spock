import { useRef, useState } from "react";
import type { MouseEvent } from "react";

type NavigationButtonsProps = {
  resetGame: () => void;
  resetTotals: () => void;
  openRulesModal: () => void;
  openGameScoresModal: () => void;
};

type Ripple = { id: number; x: number; y: number };

export default function NavigationButtons({
  resetGame,
  resetTotals,
  openRulesModal,
  openGameScoresModal,
}: NavigationButtonsProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextRippleId = useRef(0);

  // Position the ripple where the pointer pressed, relative to the button.
  const addRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const ripple = {
      id: nextRippleId.current++,
      x: e.clientX - box.left,
      y: e.clientY - box.top,
    };
    setRipples((current) => [...current, ripple]);
  };

  const removeRipple = (id: number) => {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  };

  const handleResetClick = () => {
    resetGame();
    resetTotals();
  };

  return (
    <nav className="btns">
      <button
        className="btn--reset"
        onClick={handleResetClick}
        onMouseDown={addRipple}
      >
        Reset
        {ripples.map(({ id, x, y }) => (
          <span
            key={id}
            className="ripple"
            aria-hidden="true"
            style={{ left: x, top: y }}
            onAnimationEnd={() => removeRipple(id)}
          />
        ))}
      </button>

      <div className="btn-container">
        <button className="btn--dark" onClick={openRulesModal}>
          See rules
        </button>

        <button className="btn--dark" onClick={openGameScoresModal}>
          Wins & losses
        </button>
      </div>
    </nav>
  );
}
