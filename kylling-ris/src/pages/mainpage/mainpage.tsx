import { useState, useEffect } from "react";
import FoodLogTable from "../../features/food-log/food-log-table";
import FoodSearch from "../../features/food-search/food-search";
import styles from "./mainpage.module.css";
import DatePicker from "../../features/date/date-picker";
import TitleAndLogoMainpage from "../../features/title-logo/title-logo-mainpage";
import UserMenu from "../../features/user-menu/user-menu";
import { TabView, TabPanel } from "primereact/tabview";
import "primeicons/primeicons.css";
import TitleAndLogo from "../../features/title-logo/title-logo";

export default function Mainpage() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const isMobile = screenWidth <= 1170;
  const isSmallMobile = screenWidth < 775;

  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundColor:
          currentTab === 0 || screenWidth > 1170
            ? "white"
            : screenWidth > 775
              ? "#2275c3"
              : "white"
      }}
    >
      <UserMenu />
      {isMobile ? (
        <div>
          <div className={styles.titleAndLogoContainer}>
            {isSmallMobile ? <TitleAndLogo /> : <TitleAndLogoMainpage />}
          </div>
          <TabView
            activeIndex={currentTab}
            onTabChange={(e) => {
              setCurrentTab(e.index);
            }}
          >
            <TabPanel header="Søk" leftIcon="pi pi-search-plus">
              <div className={styles.searchAndLogoCard}>
                <div className={styles.search}>
                  <FoodSearch />
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Logg" leftIcon="pi pi-list">
              <div className={styles.logAndDateCard}>
                <DatePicker />
                <div className={styles.tableWrapper}>
                  <FoodLogTable />
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      ) : (
        <>
          <div className={styles.searchAndLogoCard}>
            <div className={styles.titleAndLogoContainer}>
              <TitleAndLogoMainpage />
            </div>
            <div className={styles.search}>
              <FoodSearch />
            </div>
          </div>
          <div className={styles.logAndDateCard}>
            <DatePicker />
            <div className={styles.tableWrapper}>
              <FoodLogTable />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
