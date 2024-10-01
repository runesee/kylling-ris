import { forwardRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import styles from "./login.module.css";
import TitleAndLogo from "../../features/title-logo/title-logo";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button } from "primereact/button";
import { useSignup } from "../../features/auth/use-signup";

/*
Currently accepting username, email and password, but email is the only
value being stored in redux at the moment. Also currently only displaying
email of logged in user on main page.
*/
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

export default function RegisterPage() {
  const signUp = useSignup();
  const [currentEmail, setCurrentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const lowerCaseRegex = /(?=.*[a-z])/;
  const upperCaseRegex = /(?=.*[A-Z])/;
  const digitRegex = /(?=.*\d)/;
  const symbolRegex = /(?=.*[^\da-zA-Z])/;
  const [type, setType] = useState({
    password: "password",
    confirmPassword: "password"
  });
  const [eyeIcon, setEyeIcon] = useState({
    password: "pi pi-eye",
    confirmPassword: "pi pi-eye"
  });
  type VisibilityField = "password" | "confirmPassword";

  const validateForm = () => {
    const formErrors: FormErrors = {};
    let isValid = true;

    if (!username.trim() || username.length < 3) {
      isValid = false;
      formErrors.username = "Brukernavn må inneholde minst 3 tegn.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentEmail)) {
      isValid = false;
      formErrors.email = "E-postadresse må være gyldig.";
    }
    if (password.length < 8) {
      isValid = false;
      formErrors.password = "Passordet må inneholde minst 8 tegn.";
    } else if (!lowerCaseRegex.test(password)) {
      isValid = false;
      formErrors.password = "Passordet må inneholde minst én liten bokstav.";
    } else if (!upperCaseRegex.test(password)) {
      isValid = false;
      formErrors.password = "Passordet må inneholde minst én stor bokstav.";
    } else if (!digitRegex.test(password)) {
      isValid = false;
      formErrors.password = "Passordet må inneholde minst ett tall.";
    } else if (!symbolRegex.test(password)) {
      isValid = false;
      formErrors.password = "Passordet må inneholde minst ett symbol.";
    }
    if (password !== confirmPassword) {
      isValid = false;
      formErrors.confirmPassword = "Passordene må være like.";
    }
    setErrors(formErrors);
    return isValid;
  };

  const registerUser = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Prevent default re-routing
    const isValid = validateForm(); // Check validity of inputs

    if (isValid) {
      signUp(username, currentEmail, password).then((signupWasSuccessful) => {
        if (signupWasSuccessful) {
          setOpen(true); // Opens success alert
        } else {
          setErrors((previous) => ({
            ...previous,
            email: "E-postadressen er tatt."
          }));
        }
      });
    }
  };

  const toggleVisibility = (field: VisibilityField) => {
    setType((prevType) => {
      const newType = prevType[field] === "password" ? "text" : "password";
      return { ...prevType, [field]: newType };
    });
    setEyeIcon((prevIcon) => {
      const newEyeIcon =
        prevIcon[field] === "pi pi-eye" ? "pi pi-eye-slash" : "pi pi-eye";
      return { ...prevIcon, [field]: newEyeIcon };
    });
  };

  /* Success alert closed either manually or after 3500ms wait */
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    navigate("/project2"); // Return to main page
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.TitleAndLogoContainer}>
        <TitleAndLogo />
      </div>
      <h2 className={styles.loginHeader}>Opprett en bruker</h2>
      <form className={styles.inputForm} onSubmit={registerUser}>
        <label htmlFor="name">Brukernavn</label>
        <InputText
          className={` ${styles.inputField}`}
          name="username"
          value={username}
          keyfilter={/^\S*$/}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={24} // Currently limiting usernames to 24 characters
          data-testid="username"
          aria-label="Brukernavn"
        />
        {errors.username && (
          <small className="p-error">{errors.username}</small>
        )}
        <label htmlFor="email">E-postadresse</label>
        <InputText
          className={` ${styles.inputField}`}
          name="email"
          value={currentEmail}
          keyfilter={/^\S*$/}
          onChange={(e) => setCurrentEmail(e.target.value)}
          maxLength={255} // Max length for email addresses
          data-testid="e-mail"
          aria-label="E-postadresse"
        />
        {errors.email && <small className="p-error">{errors.email}</small>}
        <label htmlFor="password">Passord</label>
        <span className={styles.password}>
          <InputText
            className={styles.inputField}
            name="password"
            type={type.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            keyfilter={/^\S*$/}
            data-testid="password"
            aria-label="Passord"
          />
          <Button
            type="button"
            className={styles.toggleButton}
            link
            icon={eyeIcon.password}
            onClick={() => toggleVisibility("password")}
            data-testid="toggle-1"
            aria-label="Veksle synlighet"
          />
        </span>
        {errors.password && (
          <small className="p-error">{errors.password}</small>
        )}
        <label htmlFor="confirmPassword">Bekreft passord</label>
        <span className={styles.password}>
          <InputText
            className={styles.inputField}
            name="confirmPassword"
            type={type.confirmPassword}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            keyfilter={/^\S*$/}
            data-testid="confirm-password"
            aria-label="Bekreft passord"
          />
          <Button
            type="button"
            className={styles.toggleButton}
            link
            icon={eyeIcon.confirmPassword}
            onClick={() => toggleVisibility("confirmPassword")}
            data-testid="toggle-2"
            aria-label="Veksle synlighet"
          />
        </span>
        {errors.confirmPassword && (
          <small className="p-error">{errors.confirmPassword}</small>
        )}
        <button
          type="submit"
          className={`${styles.inputField} ${styles.submitButton}`}
          name="submitButton"
          disabled={!password || !confirmPassword || !currentEmail || !username}
          data-testid="submit"
        >
          Opprett bruker
        </button>
      </form>
      <span className={styles.registerLink}>
        <p className={styles.guest}>Har du allerede en bruker?</p>
        <div className={styles.guest}>
          <Link
            data-testid="navigate-login"
            className={styles.pageLink}
            to={"/project2/login"}
          >
            <p>Tilbake til innloggingssiden</p>
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
      <Snackbar open={open} autoHideDuration={3500} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Brukeren har blitt opprettet!
        </Alert>
      </Snackbar>
    </div>
  );
}
