import { CHOICES, SELECTIONS, type Selection } from "../utils/choices";

type SelectionButtonsProps = {
  handleSelection: (choice: Selection) => void;
};

export default function SelectionButtons({
  handleSelection,
}: SelectionButtonsProps) {
  return (
    <>
      {SELECTIONS.map((selection) => {
        const { label, symbol, iconDescription } = CHOICES[selection];
        return (
          <button
            key={selection}
            className="selection"
            aria-label={`${label} icon: ${iconDescription}`}
            onClick={() => handleSelection(selection)}
          >
            {symbol}
          </button>
        );
      })}
    </>
  );
}
