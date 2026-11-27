import { useState } from "react";
import { getComputerChoice } from "./utils/computerChoice";
import { getGameOutcome, playGameRound } from "./utils/gameLogic";
import { CHOICES, type Selection } from "./utils/choices";
import { useGameTotals } from "./hooks/useGameTotals";
import RulesModal from "./components/RulesModal";
import ScoresModal from "./components/ScoresModal";
import ResultColumn from "./components/ResultColumn";
import NavigationButtons from "./components/NavigationButtons";
import SelectionButtons from "./components/SelectionButtons";
import Footer from "./components/Footer";

export type Result = {
  symbol: string;
  isWinner: boolean;
};

type RoundResult = {
  player: Result;
  computer: Result;
};

function GameComponent() {
  const { totalWins, totalLosses, recordGame, resetTotals } = useGameTotals();

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [showRulesModal, setShowRulesModal] = useState(true);
  const [showGameScoresModal, setShowGameScoresModal] = useState(false);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const gameOutcome = getGameOutcome(playerScore, computerScore);
  const isGameOver = gameOutcome !== null;

  const handleSelection = (selection: Selection) => {
    if (isGameOver) return;

    const playerChoice = CHOICES[selection];
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

    setHistory((prev) => [
      {
        player: {
          symbol: playerChoice.symbol,
          isWinner: roundResult === "WIN",
        },
        computer: {
          symbol: computerChoice.symbol,
          isWinner: roundResult === "LOSE",
        },
      },
      ...prev,
    ]);
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
          <ResultColumn
            label="Player"
            score={playerScore}
            results={history.map((round) => round.player)}
          />

          <ResultColumn
            label="Computer"
            score={computerScore}
            results={history.map((round) => round.computer)}
            extraClass="loss"
          />
        </section>

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

export default GameComponent;
