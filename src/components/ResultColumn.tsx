import { CHOICES } from "../utils/choices";
import { isRoundWinner, type Round, type Side } from "../utils/gameLogic";

const LABELS: Record<Side, string> = { player: "Player", computer: "Computer" };

const SCORE_CLASSES: Record<Side, string> = {
  player: "player-game-score",
  computer: "computer-game-score",
};

type ResultColumnProps = {
  side: Side;
  score: number;
  /** Rounds played so far, latest first. */
  rounds: Round[];
};

export default function ResultColumn({ side, score, rounds }: ResultColumnProps) {
  return (
    <div className="result-column">
      <div>
        <span>{LABELS[side]}:</span>
        <span
          className={`score ${SCORE_CLASSES[side]}`}
          data-testid={`${side}-score`}
        >
          {score}
        </span>
      </div>
      {rounds.map((round, index) => {
        const { label, symbol } = CHOICES[round[side]];
        const isWinner = isRoundWinner(round, side);
        return (
          <div
            key={round.id}
            className={isWinner ? "result winner" : "result"}
            role="img"
            aria-label={isWinner ? `${label}, won the round` : label}
            data-testid={
              index === 0 ? `${side}-latest-result` : `${side}-result-${index}`
            }
          >
            {symbol}
          </div>
        );
      })}
    </div>
  );
}
