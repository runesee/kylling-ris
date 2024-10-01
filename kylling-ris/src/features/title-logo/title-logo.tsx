import { Link } from "react-router-dom";
import styles from "./title-logo.module.css";
import logo from "../../assets/logo.svg";

export default function TitleAndLogo() {
  return (
    <div className={styles.titleAndSubtitle}>
      <div className={styles.pageTitleContainer}>
        <Link className={styles.pageLink} to={"/project2"}>
          <h1 className={styles.pageTitleBlue}>
            Kylling<span className={styles.pageTitleRed}>&</span>Ris
          </h1>
          <img className={styles.logo} src={logo} alt="Kylling&Ris logo"></img>
        </Link>
      </div>
      <h3 className={styles.subtitle}>Kaloriteller</h3>
    </div>
  );
}
