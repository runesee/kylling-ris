import DataTable, { TableColumn } from "react-data-table-component";
import { useState } from "react";
import { HiTrash, HiPencilAlt } from "react-icons/hi";
import styles from "./food-log-table.module.css";
import { foodLogTableStyles } from "./food-log-table-styles";
import { useSelector } from "react-redux";
import FoodItem from "./food-item";
import { RootState } from "../../redux/store";
import { useDeleteFoodFromLog, useFoodLog } from "./use-food-log";
import appropriateUnit from "../misc/appropriate-unit";
import EditWeightPopup from "./edit-weight-popup";

export default function FoodLogTable() {
  const selectedDate = useSelector(
    (state: RootState) => state.foodLog.selectedDate
  );
  const { foodLog, loading } = useFoodLog(selectedDate);
  const [editWeightPopupOpen, setEditWeightPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [selectedWeightUnit, setSelectedWeightUnit] = useState("");
  const deleteFoodFromLog = useDeleteFoodFromLog();

  // 775px is the breakpoint for the compact version.
  const [compact, setCompact] = useState<boolean>(window.innerWidth <= 775);

  // Set the 'compact' state based on the window width
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 775) {
      setCompact(true);
    } else {
      setCompact(false);
    }
  });

  const nameColumn: TableColumn<FoodItem> = {
    name: "Navn",
    selector: (row) => row.name
  };

  const buttonsColumn: TableColumn<FoodItem> = {
    button: true,
    cell: (row) => (
      <div className={styles.buttons}>
        <button
          className={styles.deleteButton}
          aria-label="fjern mat"
          onClick={() => {
            deleteFoodFromLog(row.id);
          }}
          data-testid="delete-food-button"
        >
          <HiTrash className={styles.deleteIcon} strokeWidth={0} size={19} />
        </button>
        <button
          className={styles.editButton}
          aria-label="rediger mat"
          onClick={() => {
            setSelectedId(row.id);
            setSelectedWeightUnit(row.weightUnit);
            setSelectedWeight(row.weight);
            setEditWeightPopupOpen(true);
          }}
          data-testid="edit-weight-button"
        >
          <HiPencilAlt
            className={styles.deleteIcon}
            strokeWidth={0}
            size={19}
          />
        </button>
      </div>
    )
  };

  // Define the additional columns that are specific to the non-compact version
  const additionalColumns: TableColumn<FoodItem>[] = [
    {
      name: "Vekt",
      selector: (row) => appropriateUnit(row.weight, row.weightUnit)
    },
    {
      name: "Kalorier (kcal)",
      selector: (row) => Math.round(row.calories * 100) / 100
    },
    {
      name: "Protein (g)",
      selector: (row) => Math.round(row.protein * 100) / 100
    }
  ];

  // Construct the columns array based on the 'compact' condition
  // If compact, only use the name and delete button columns
  // Otherwise, include the additional columns as well
  const columns: TableColumn<FoodItem>[] = compact
    ? [nameColumn, buttonsColumn]
    : [nameColumn, ...additionalColumns, buttonsColumn];

  const ExpandedRowComponent = ({ data: food }: { data: FoodItem }) => (
    <div className={styles.expandedRow}>
      <p>
        Vekt: {food.weight}
        {food.weightUnit}
      </p>
      <p>Kalorier (kcal): {food.calories}</p>
      <p>Protein (g): {food.protein}</p>
    </div>
  );

  return (
    <div>
      <div className={styles.totals}>
        <h2 className={styles.totalCalories}>
          Kalorier:{" "}
          {Math.round(
            foodLog.reduce((total, food) => total + food.calories, 0) * 10
          ) / 10}
          kcal
        </h2>
        <h2 className={styles.totalProtein}>
          Protein:{" "}
          {Math.round(
            foodLog.reduce((total, food) => total + food.protein, 0) * 10
          ) / 10}
          g
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={foodLog}
        customStyles={foodLogTableStyles}
        pagination
        expandableRows={compact}
        expandOnRowClicked
        expandableRowsComponent={ExpandedRowComponent}
        paginationComponentOptions={{ noRowsPerPage: true }}
        responsive
        noDataComponent={
          loading ? (
            <></>
          ) : (
            <p className={styles.placeholder}>
              Du har ikke loggført noe i dag. Gjør et søk og trykk på
              ‘+’-knappen for å registrere en matvare, og få oversikt over
              kalori- og proteininntaket ditt.
            </p>
          )
        }
      />
      <EditWeightPopup
        id={selectedId}
        weight={selectedWeight}
        weightUnit={selectedWeightUnit}
        open={editWeightPopupOpen}
        onClose={() => setEditWeightPopupOpen(false)}
      />
    </div>
  );
}
