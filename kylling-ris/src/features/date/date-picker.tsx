import moment from "moment";
import "moment/locale/nb";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./date-picker.module.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { selectDate } from "../food-log/food-log-reducer";
import { Calendar } from "primereact/calendar";
import "./primereact-theme.css";
import { addLocale } from "primereact/api";
import { FormEvent } from "primereact/ts-helpers";
import { Tooltip } from "react-tooltip";
import { FaRegCalendarAlt } from "react-icons/fa";
import { RootState } from "../../redux/store";

export default function DatePicker() {
  const [disableForward, setDisableForward] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [touchUI, setTouchUI] = useState(window.innerWidth <= 775);
  const calendarRef = useRef<HTMLDivElement>(null);
  const weekdayRef = useRef<HTMLHeadingElement>(null);

  const dispatch = useDispatch();
  const selectedDate = useSelector(
    (state: RootState) => state.foodLog.selectedDate
  );
  moment.locale("nb");

  // UseEffect that adds event listeners to the document, and removes them when the component unmounts
  useEffect(() => {
    // Method to be used inside an event listener that closes the calendar when the user clicks outside of it
    const handleClickOutside = (event: MouseEvent) => {
      // The calendar should not close when the user clicks on the weekday.
      // This ensures no weird behavior with the calendar closing and opening immediately
      const excluded = [weekdayRef.current];
      if (
        !excluded.some((e) => e?.contains(event.target as Node)) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    // Method to be used inside an event listener to set the touchUI state for the calendar based on the window width
    const handleResize = () => {
      if (window.innerWidth <= 775) {
        setTouchUI(true);
      } else {
        setTouchUI(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    window.addEventListener("resize", handleResize, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("resize", handleResize, true);
    };
  }, []);

  useEffect(() => {
    const isToday = moment(selectedDate).isSame(moment(), "day");

    // The user should not be able to navigate to future dates
    setDisableForward(isToday);
  }, [selectedDate]);

  /**
   * Helper method to increment the date by one day, also closes the calendar
   * Used by the forward arrow element
   */
  const handleIncrementDate = () => {
    if (!disableForward) {
      const nextDay = moment(selectedDate).add(1, "days").toDate();
      formatTime(nextDay);
      dispatch(selectDate({ date: nextDay.toISOString().split("T")[0] }));
      setShowCalendar(false);
    }
  };

  /**
   * Helper method to decrement the date by one day, also closes the calendar
   * Used by the backward arrow element
   */
  const handleDecrementDate = () => {
    const previousDay = moment(selectedDate).subtract(1, "days").toDate();
    formatTime(previousDay);
    dispatch(selectDate({ date: previousDay.toISOString().split("T")[0] }));
    setShowCalendar(false);
  };

  const months = [
    "januar",
    "februar",
    "mars",
    "april",
    "mai",
    "juni",
    "juli",
    "august",
    "september",
    "oktober",
    "november",
    "desember"
  ];

  const weekdays = [
    "Søndag",
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag"
  ];

  // Adds the norwegian locale to the calendar
  addLocale("no", {
    firstDayOfWeek: 1,
    dayNamesMin: ["S", "M", "T", "O", "T", "F", "L"],
    monthNames: months,
    monthNamesShort: [
      "jan",
      "feb",
      "mar",
      "apr",
      "mai",
      "jun",
      "jul",
      "aug",
      "sep",
      "okt",
      "nov",
      "des"
    ]
  });

  /**
   * Fires when the user selects a date from the calendar
   * @param event The change event from the calendar
   */
  function handleDatePickerChange(
    event: FormEvent<Date, SyntheticEvent<Element, Event>>
  ): void {
    const dateFromCalendar = event.value;
    if (dateFromCalendar) {
      formatTime(dateFromCalendar);
      dispatch(
        selectDate({ date: dateFromCalendar.toISOString().split("T")[0] })
      );
      setShowCalendar(false);
    }
  }

  // This code handles a bug where the date would be set to the previous day if the user selected a date from the calendar.
  // It sets the hours, minutes and seconds to the current time to avoid this issue.
  function formatTime(date: Date) {
    date?.setHours(new Date().getHours());
    date?.setMinutes(new Date().getMinutes());
    date?.setSeconds(new Date().getSeconds());
  }

  // Using Intl.DateTimeFormat to format the date in Norwegian
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("nb-NO", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  };
  const displayDate = formatDate(selectedDate);
  const displayWeekday = weekdays[moment(selectedDate).day()];

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      setShowCalendar(true);
    }
  }

  return (
    <div className={styles.dateInfo} data-testid="date-picker">
      <div className={styles.weekdayNavigation}>
        <FiChevronLeft
          className={styles.navigationArrow}
          size={30}
          onClick={handleDecrementDate}
          data-testid="backward-arrow"
        />
        <h1
          ref={weekdayRef}
          className={styles.weekday}
          onClick={() => setShowCalendar(true)}
          data-testid="weekday"
          data-tooltip-id="weekday-tooltip"
          data-tooltip-content="Trykk for å åpne kalenderen"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {displayWeekday} <FaRegCalendarAlt size={25} />
        </h1>
        <Tooltip
          id="weekday-tooltip"
          style={{ backgroundColor: "#3f3f40", color: "white" }}
        />
        <FiChevronRight
          className={
            disableForward
              ? styles.disabledNaviagtionArrow
              : styles.navigationArrow
          }
          size={30}
          onClick={handleIncrementDate}
          data-testid="forward-arrow"
        />
      </div>
      <p className={styles.date} data-testid="full-date">
        {displayDate}
      </p>
      {showCalendar && (
        <div
          ref={calendarRef}
          className={styles.calendarContainer}
          data-testid="calendar-container"
        >
          <Calendar
            inline
            locale="no"
            dateFormat="dd/mm/yy"
            touchUI={touchUI}
            maxDate={new Date()}
            onChange={handleDatePickerChange}
            value={new Date(selectedDate)}
            data-testid="calendar"
          />
        </div>
      )}
    </div>
  );
}
