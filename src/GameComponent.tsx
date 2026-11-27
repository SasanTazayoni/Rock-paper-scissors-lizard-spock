import { useState } from "react";
import { getComputerChoice } from "./utils/computerChoice";
import { getPlayerChoice } from "./utils/playerChoice";
import { playGameRound } from "./utils/gameLogic";
import { Selection } from "./utils/rules";
import { useGameTotals } from "./hooks/useGameTotals";
import { useOverlayHeight } from "./hooks/useOverlayHeight";
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
  const isGameOver = playerScore >= 5 || computerScore >= 5;
  const isOverlayOpen = showRulesModal || showGameScoresModal || isGameOver;

  useOverlayHeight(isOverlayOpen);

  const handleSelection = (selection: Selection) => {
    if (isGameOver) return;

    const playerChoice = getPlayerChoice(selection);
    const computerChoice = getComputerChoice();

    const roundResult = playGameRound(selection, computerChoice);

    const nextPlayerScore = playerScore + (roundResult === "WIN" ? 1 : 0);
    const nextComputerScore = computerScore + (roundResult === "LOSE" ? 1 : 0);

    setPlayerScore(nextPlayerScore);
    setComputerScore(nextComputerScore);

    if (nextPlayerScore >= 5 || nextComputerScore >= 5) {
      recordGame(nextPlayerScore >= 5 ? "WIN" : "LOSE");
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
      <nav className="btns">
        <NavigationButtons
          resetGame={resetGame}
          resetTotals={resetTotals}
          openRulesModal={openRulesModal}
          openGameScoresModal={() => setShowGameScoresModal(true)}
        />
      </nav>

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
            isGameOver={isGameOver}
            gameOutcome={playerScore > computerScore ? "WIN" : "LOSE"}
            totalWins={totalWins}
            totalLosses={totalLosses}
            closeGameScoresModal={closeGameScoresModal}
          />
        )}

        {isOverlayOpen && <div className="overlay open" data-overlay></div>}
      </main>
      <Footer></Footer>
    </>
  );
}

export default GameComponent;
