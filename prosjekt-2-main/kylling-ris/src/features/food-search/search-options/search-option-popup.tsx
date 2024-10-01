import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./search-option-popup.module.css";
import { changeSort, setAllergens } from "./search-option-reducer";
import { RootState } from "../../../redux/store";
import { Tooltip } from "react-tooltip";

interface AllergenIsShown {
  [allergen: string]: boolean;
}

const allergensNotShown = (allergenIsAlloweds: AllergenIsShown): string[] => {
  return Object.entries(allergenIsAlloweds)
    .filter(([_, isShowing]) => !isShowing)
    .map(([allergen, _]) => allergen);
};

const ALLERGENS = [
  "Gluten",
  "Melk",
  "Egg",
  "Soya",
  "Sulfitt",
  "Fisk",
  "Skalldyr",
  "Sesam",
  "Selleri",
  "Sennep",
  "Nøtter",
  "Peanøtter"
];

export default function FilterOptionPopup() {
  const [showAllergens, setShowAllergens] = useState(false);
  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const { sortOption, allergens } = useSelector(
    (state: RootState) => state.searchOption
  );
  const dispatch = useDispatch();
  const searchInput = useSelector(
    (state: RootState) => state.searchInput.searchInput
  );

  const [allergenIsAllowed, setAllergenIsAllowed] = useState<AllergenIsShown>(
    ALLERGENS.reduce(
      (acc, allergen) => ({
        ...acc,
        [allergen]: !allergens.includes(allergen)
      }),
      {}
    )
  );

  useEffect(() => {
    dispatch(setAllergens(allergensNotShown(allergenIsAllowed)));
  }, [allergenIsAllowed, dispatch]);

  useEffect(() => {
    setOptionsDisabled(searchInput !== "");
  }, [searchInput]);

  return (
    <div>
      <div className={styles.filterContent}>
        <div className={styles.title}>Filtrer og sorter</div>

        <select
          disabled={optionsDisabled}
          className={styles.dropdown}
          name="sort"
          value={sortOption}
          onChange={({ target: { value: sort } }) => {
            dispatch(changeSort(sort));
          }}
          data-testid="sort-dropdown"
          data-tooltip-id="sort-tooltip"
          data-tooltip-content="Sortering er foreløpig kun mulig på tomt søk"
        >
          <option value="name-ascending" data-testid="sort-name-ascending">
            Navn a-å
          </option>
          <option value="name-descending" data-testid="sort-name-descending">
            Navn å-a
          </option>
          <option
            value="protein-ascending"
            data-testid="sort-protein-ascending"
          >
            Proteiner pr. 100g/ml (stigende)
          </option>
          <option
            value="protein-descending"
            data-testid="sort-protein-descending"
          >
            Proteiner pr. 100g/ml (synkende)
          </option>
          <option value="kcal-ascending" data-testid="sort-kcal-ascending">
            Kalorier pr. 100g/ml (stigende)
          </option>
          <option value="kcal-descending" data-testid="sort-kcal-descending">
            Kalorier pr. 100g/ml (synkende)
          </option>
        </select>
        {optionsDisabled && (
          <Tooltip
            id="sort-tooltip"
            style={{ backgroundColor: "#3f3f40", color: "white" }}
          />
        )}

        <button
          className={styles.button}
          onClick={() => setShowAllergens(!showAllergens)}
          data-testid="show-allergens-button"
        >
          {showAllergens ? "Gjem allergener" : "Vis allergener"}
        </button>

        {showAllergens && (
          <div className={styles.allergensOptions}>
            {ALLERGENS.map((allergen) => (
              <div key={allergen} className={styles.labelCheckboxContainer}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  name={allergen}
                  id={allergen.toLowerCase()}
                  checked={allergenIsAllowed[allergen]}
                  onChange={() =>
                    setAllergenIsAllowed((prev) => ({
                      ...prev,
                      [allergen]: !prev[allergen]
                    }))
                  }
                  data-testid="allergen"
                />
                <label>Inneholder {allergen.toLowerCase()}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
