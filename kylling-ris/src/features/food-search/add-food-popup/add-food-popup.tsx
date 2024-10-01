import FoodInfo from "../search-results/food-info";
import styles from "./add-food-popup.module.css";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import nb from "date-fns/locale/nb";
registerLocale("nb", nb);
import { useAddFoodToLog } from "../../food-log/use-food-log";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { selectDate } from "../../food-log/food-log-reducer";
import { CiCirclePlus } from "react-icons/ci";

interface AddFoodPopupProps {
  food: FoodInfo;
}

export default function AddFoodPopup({ food }: AddFoodPopupProps) {
  const [weightInputColor, setWeightInputColor] = useState<string>("black");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [weightInput, setWeightInput] = useState<string>(
    `${food.defaultWeight}`
  );
  const selectedDate = useSelector(
    (state: RootState) => state.foodLog.selectedDate
  );
  const addFoodToLog = useAddFoodToLog();

  const dispatch = useDispatch();

  const initalFocus = useRef(null);

  function openModal() {
    setIsOpen(true);
    setWeightInputColor("black");
    setWeightInput(`${food.defaultWeight}`);
  }

  const submitFood = () => {
    if (!datePickerOpen) {
      const weight = Number(weightInput);
      if (isNaN(weight) || weight <= 0) {
        setWeightInputColor("red");
        return;
      }
      addFoodToLog(food.id, weight, selectedDate);

      setIsOpen(false);
    }
  };

  const calendarRef = useRef<HTMLDivElement>(null);

  function handleDateChosen(date: Date | null) {
    if (date) {
      date?.setHours(new Date().getHours());
      date?.setMinutes(new Date().getMinutes());
      date?.setSeconds(new Date().getSeconds());

      // Updates the date in the redux store
      dispatch(selectDate({ date: date.toISOString().split("T")[0] }));
    }
  }

  return (
    <>
      <button
        className={styles.addButton}
        onClick={openModal}
        aria-label="Legg til mat"
        data-testid="add-food-button"
      >
        <CiCirclePlus size={40} strokeWidth={0.25} />
      </button>
      <Transition appear show={isOpen}>
        <Dialog
          open={isOpen}
          initialFocus={initalFocus}
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            enter={styles.enter}
            enterFrom={styles.enterFrom}
            enterTo={styles.enterTo}
            leave={styles.leave}
            leaveFrom={styles.leaveFrom}
            leaveTo={styles.leaveTo}
          >
            <div className={styles.background} />
          </Transition.Child>
          <Dialog.Panel className={styles.addFoodPopup}>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              tabIndex={-1}
            ></button>
            <Dialog.Title className={styles.title}>{food.name}</Dialog.Title>
            <div className={styles.bottom}>
              <div
                ref={calendarRef}
                className={`${styles.datePickerWrapper} ${"card flex justify-content-center"}`}
              >
                <label className={styles.datePickerLabel} htmlFor="datepicker">
                  Velg en dato
                </label>
                <DatePicker
                  selected={new Date(selectedDate)}
                  onChange={(date) => handleDateChosen(date)}
                  dateFormat="dd/MM/yy"
                  maxDate={new Date()}
                  locale="nb"
                  className={styles.datePicker}
                  name="datepicker"
                  onCalendarOpen={() => setDatePickerOpen(true)}
                  onCalendarClose={() => setDatePickerOpen(false)}
                  wrapperClassName="datePickerPopup"
                />
              </div>
              <div className={styles.weightInput}>
                <input
                  ref={initalFocus}
                  style={{ color: weightInputColor }}
                  value={weightInput}
                  onChange={({ target: { value: weightInput } }) =>
                    setWeightInput(weightInput)
                  }
                  data-testid="weight-input"
                />
                <div>{food.weightUnit}</div>
              </div>
              <button
                className={styles.submitButton}
                onClick={() => {
                  submitFood();
                }}
              >
                Legg til
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </>
  );
}
