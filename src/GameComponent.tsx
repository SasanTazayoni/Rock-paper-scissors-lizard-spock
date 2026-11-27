import { useRef, useState } from "react";
import { getComputerChoice } from "./utils/computerChoice";
import { getGameOutcome, playGameRound, type Round } from "./utils/gameLogic";
import type { Selection } from "./utils/choices";
import { describeRound } from "./utils/describeRound";
import { useGameTotals } from "./hooks/useGameTotals";
import RulesModal from "./components/RulesModal";
import ScoresModal from "./components/ScoresModal";
import ResultColumn from "./components/ResultColumn";
import NavigationButtons from "./components/NavigationButtons";
import SelectionButtons from "./components/SelectionButtons";
import Footer from "./components/Footer";

export default function GameComponent() {
  const { totalWins, totalLosses, recordGame, resetTotals } = useGameTotals();

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [showRulesModal, setShowRulesModal] = useState(true);
  const [showGameScoresModal, setShowGameScoresModal] = useState(false);
  /** Rounds played this game, latest first. */
  const [history, setHistory] = useState<Round[]>([]);
  const nextRoundId = useRef(0);
  const gameOutcome = getGameOutcome(playerScore, computerScore);
  const isGameOver = gameOutcome !== null;
  const latestRound = history[0];

  const handleSelection = (selection: Selection) => {
    if (isGameOver) return;

    const computerChoice = getComputerChoice();

    const roundResult = playGameRound(selection, computerChoice.name);

    const nextPlayerScore = playerScore + (roundResult === "WIN" ? 1 : 0);
    const nextComputerScore = computerScore + (roundResult === "LOSE" ? 1 : 0);

    setPlayerScore(nextPlayerScore);
    setComputerScore(nextComputerScore);

    const nextGameOutcome = getGameOutcome(nextPlayerScore, nextComputerScore);
    if (nextGameOutcome) {
      recordGame(nextGameOutcome);
      setShowGameScoresModal(true);
    }

    const round: Round = {
      id: nextRoundId.current++,
      player: selection,
      computer: computerChoice.name,
      outcome: roundResult,
    };
    setHistory((prev) => [round, ...prev]);
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setHistory([]);
  };

  const openRulesModal = () => {
    setShowRulesModal(true);
  };

  const closeGameScoresModal = () => {
    setShowGameScoresModal(false);
    if (isGameOver) {
      resetGame();
    }
  };

  return (
    <>
      <NavigationButtons
        resetGame={resetGame}
        resetTotals={resetTotals}
        openRulesModal={openRulesModal}
        openGameScoresModal={() => setShowGameScoresModal(true)}
      />

      <header>
        <h1>Rock Paper Scissors Lizard Spock game</h1>
      </header>

      <main>
        <section className="selections">
          <SelectionButtons handleSelection={handleSelection} />
        </section>

        <section className="scores">
          <ResultColumn side="player" score={playerScore} rounds={history} />
          <ResultColumn side="computer" score={computerScore} rounds={history} />
        </section>

        {/* Announces each round to screen readers. Always rendered, so
            assistive tech is already watching it when the text changes. */}
        <p className="visually-hidden" role="status" data-testid="round-status">
          {latestRound &&
            describeRound(
              latestRound,
              history.length,
              playerScore,
              computerScore,
            )}
        </p>

        <RulesModal
          showRulesModal={showRulesModal}
          closeRulesModal={() => setShowRulesModal(false)}
        />

        {showGameScoresModal && (
          <ScoresModal
            outcome={gameOutcome}
            totalWins={totalWins}
            totalLosses={totalLosses}
            closeGameScoresModal={closeGameScoresModal}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
