import { Link } from "react-router-dom";
import styles from "./title-logo.module.css";
import mainPageStyles from "./title-logo-mainpage.module.css";
import logo from "../../assets/logo.svg";

export default function TitleAndLogoMainpage() {
  return (
    <div className={styles.titleAndSubtitle}>
      <Link className={styles.pageLink} to={"/project2"}>
        <div className={mainPageStyles.linkContainer}>
          <div className={mainPageStyles.imageContainer}>
            <img
              className={`${styles.logo} ${mainPageStyles.logo}`}
              src={logo}
              alt="Kylling&Ris logo"
            ></img>
          </div>
          <div className={mainPageStyles.titleAndSubtitle}>
            <h1 className={styles.pageTitleBlue}>
              Kylling<span className={styles.pageTitleRed}>&</span>Ris
            </h1>
            <h3 className={mainPageStyles.subtitle}>Kaloriteller</h3>
          </div>
        </div>
      </Link>
    </div>
  );
}
