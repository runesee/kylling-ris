import { Dialog } from "primereact/dialog";
import styles from "./edit-weight-popup.module.css";
import { useEffect, useState } from "react";
import useOnKeyDown from "../misc/use-on-key-down";
import { useEditFood } from "./use-food-log";

interface EditWeightPopupProps {
  id: number;
  weight: number;
  weightUnit: string;
  open: boolean;
  onClose: () => void;
}

export default function EditWeightPopup({
  id,
  weight,
  weightUnit,
  open,
  onClose
}: EditWeightPopupProps) {
  const [weightInputColor, setWeightInputColor] = useState<string>("black");
  const [weightInput, setWeightInput] = useState("");

  useEffect(() => {
    setWeightInput(weight.toString());
  }, [weight]);

  const editFood = useEditFood();

  const submitFood = () => {
    const weight = Number(weightInput);
    if (isNaN(weight) || weight <= 0) {
      setWeightInputColor("red");
      return;
    }
    setWeightInputColor("black");
    editFood(id, parseInt(weightInput));

    onClose();
  };

  useOnKeyDown(
    () => {
      if (open) {
        submitFood();
      }
    },
    ["Enter"],
    [weightInput, open]
  );

  return (
    <Dialog
      className={styles.editWeightPopup}
      visible={open}
      onHide={onClose}
      draggable={false}
      dismissableMask={true}
      closable={true}
      resizable={false}
      data-testid="edit-weight-popup"
    >
      <div className={styles.content}>
        <h1 className={styles.header} data-testid="header">
          Rediger vekt
        </h1>
        <div className={styles.weightInput}>
          <input
            style={{ color: weightInputColor }}
            autoFocus
            value={weightInput}
            onChange={({ target: { value: weightInput } }) => {
              setWeightInput(weightInput);
            }}
            data-testid="weight-input"
          />
          <div data-testid="weight-unit">{weightUnit}</div>
        </div>
        <button
          className={styles.submitButton}
          onClick={() => {
            submitFood();
          }}
          data-testid="submit-button"
        >
          Bekreft
        </button>
      </div>
    </Dialog>
  );
}
