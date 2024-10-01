import styles from "./errorpage.module.css";
import TitleAndLogoMainpage from "../../features/title-logo/title-logo-mainpage";
import { useEffect, useState } from "react";
import TitleAndLogo from "../../features/title-logo/title-logo";

export default function ErrorPage() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isMobile = screenWidth < 1170;
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className={styles.errorWrapper} id="error-page">
      {isMobile ? <TitleAndLogo /> : <TitleAndLogoMainpage />}
      <div className={styles.message}>
        <h1>Her har det skjedd en feil!</h1>
        <p>Beklager, denne siden finnes ikke.</p>
      </div>
    </div>
  );
}
