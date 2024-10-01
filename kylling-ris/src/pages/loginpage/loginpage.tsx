import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import TitleAndLogo from "../../features/title-logo/title-logo";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useLogin } from "../../features/auth/use-login";

export default function LoginPage() {
  const [visibility, setVisibility] = useState(false);
  const [type, setType] = useState("password");
  const [eyeIcon, setEyeIcon] = useState("pi pi-eye");
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const logIn = useLogin();
  const [loginError, setLoginError] = useState<string>("");

  function handleUserLogin(event: React.FormEvent) {
    event.preventDefault(); // Prevent default re-routing
    logIn(currentEmail, currentPassword).then((loginWasSuccessful) => {
      if (loginWasSuccessful) {
        navigate("/project2");
      } else {
        setLoginError("Feil e-postadresse eller passord.");
      }
    });
  }

  const toggleVisibility = () => {
    if (visibility) {
      setVisibility(false);
      setType("password");
      setEyeIcon("pi pi-eye");
    } else {
      setVisibility(true);
      setType("text");
      setEyeIcon("pi pi-eye-slash");
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.TitleAndLogoContainer}>
        <TitleAndLogo />
      </div>
      <h2 className={styles.loginHeader}>Logg inn</h2>
      <small className="p-error">{loginError}</small>
      <form onSubmit={handleUserLogin} className={styles.inputForm}>
        <label htmlFor="email">E-postadresse</label>
        <InputText
          className={styles.inputField}
          name="email"
          keyfilter="email"
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          maxLength={255} // Max length for email addresses
          data-testid="e-mail"
          aria-label="E-postadresse"
        />
        <label htmlFor="password">Passord</label>
        <span className={styles.password}>
          <InputText
            className={styles.inputField}
            name="password"
            type={type}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            keyfilter={/^\S*$/}
            data-testid="password"
            aria-label="Passord"
          />
          <Button
            type="button"
            className={styles.toggleButton}
            link
            icon={eyeIcon}
            onClick={toggleVisibility}
            data-testid="toggle"
            aria-label="Veksle synlighet"
          />
        </span>
        <button
          type="submit"
          className={`${styles.inputField} ${styles.submitButton}`}
          name="submitButton"
          disabled={!currentEmail || !currentPassword}
          data-testid="submit"
        >
          Logg inn
        </button>
      </form>
      <span className={styles.registerLink}>
        <p className={styles.guest}>Har du ikke en bruker?</p>
        <div className={styles.guest}>
          <Link
            data-testid="navigate-register"
            className={styles.pageLink}
            to={"/project2/register"}
          >
            <p>Opprett en ny bruker</p>
          </Link>
        </div>
        <div>
          <Link
            data-testid="navigate-mainpage"
            className={styles.pageLink}
            to={"/project2"}
          >
            <p>Fortsett som gjest</p>
          </Link>
        </div>
      </span>
    </div>
  );
}
