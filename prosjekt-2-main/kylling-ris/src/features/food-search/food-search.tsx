import SearchResults from "./search-results/search-results";
import { useEffect, useState } from "react";
import styles from "./food-search.module.css";
import { IoSearch } from "react-icons/io5";

import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import FilterOptionPopup from "./search-options/search-option-popup";

import { Popover, Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { setSearchInput } from "./searchReducer";

export default function FoodSearch() {
  const [localSearchInput, setLocalSearchInput] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchInput(localSearchInput));
  }, [localSearchInput, dispatch]);

  return (
    <div className={styles.foodSearch}>
      <div className={styles.searchBar}>
        <IoSearch
          size={40}
          className={styles.searchIcon}
          data-testid="search-icon"
        />
        <input
          placeholder="Søk"
          aria-label="Søk"
          value={localSearchInput}
          onChange={({ target: { value: searchInput } }) => {
            setLocalSearchInput(searchInput);
          }}
          data-testid="search-bar"
        />
        <Popover className={styles.filterWrapper}>
          <Popover.Button
            className={styles.filterButton}
            aria-label="Filter"
            data-testid="filter-button"
          >
            <HiOutlineAdjustmentsHorizontal
              className={styles.filterImage}
              size={40}
            />
          </Popover.Button>
          <Transition
            enter={styles.enter}
            enterFrom={styles.enterFrom}
            enterTo={styles.enterTo}
            leave={styles.leave}
            leaveFrom={styles.leaveFrom}
            leaveTo={styles.leaveTo}
          >
            <Popover.Panel>
              <FilterOptionPopup />
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
      <SearchResults searchQuery={localSearchInput} />
    </div>
  );
}
