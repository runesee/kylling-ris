import styles from "./user-menu.module.css";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import { Alert, Snackbar } from "@mui/material";
import { useUser } from "../auth/use-user";

export default function UserMenu() {
  const { user, logOut } = useUser();
  const menu = useRef<Menu>(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logIn = () => {
    navigate("/project2/login");
  };

  // Menu items when logged in
  const loggedInItems: MenuItem[] = [
    {
      label: user?.name
        ? user.name.length > 24
          ? `${user.name.substring(0, 21)}...`
          : user.name
        : "",
      items: [
        {
          label: "Logg ut",
          icon: "pi pi-user-minus",
          command: () => {
            logOut();
            setOpen(true);
          }
        }
      ]
    }
  ];

  // Menu items when not logged in
  const notLoggedInItems: MenuItem[] = [
    {
      label: "Logg inn",
      icon: "pi pi-user-plus",
      command: () => {
        logIn();
      }
    }
  ];

  // Handle alert confirming user logout
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  // Repurposed window resize listener from food log table
  const [compact, setCompact] = useState<boolean>(window.innerWidth <= 1170);
  // Set the 'compact' state based on the window width
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 1170) {
      setCompact(true);
    } else {
      setCompact(false);
    }
  });

  return (
    <div>
      {!user?.email && <h3 className={styles.label}>Gjest</h3>}
      <div className={styles.userMenu}>
        <div className="card flex justify-content-center">
          <Avatar
            onClick={(event) => menu.current?.toggle(event)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                menu.current?.toggle(event);
              }
            }}
            tabIndex={0}
            aria-controls="popup_menu_right"
            aria-haspopup
            label={user?.email ? user.name[0] : ""}
            icon={user?.email ? "" : "pi pi-user"}
            style={
              compact
                ? {
                    backgroundColor: "#2275c3",
                    color: "white",
                    border: "1px solid black",
                    width: "40px",
                    height: "40px"
                  }
                : {
                    backgroundColor: "white",
                    color: "#2275c3",
                    border: "1px solid black",
                    width: "40px",
                    height: "40px"
                  }
            }
            shape="circle"
          />
          {user?.email ? (
            <Menu
              ref={menu}
              popup
              model={loggedInItems}
              popupAlignment="right"
            />
          ) : (
            <Menu
              ref={menu}
              popup
              model={notLoggedInItems}
              popupAlignment="right"
            />
          )}
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={3500} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Du har blitt logget ut!
        </Alert>
      </Snackbar>
    </div>
  );
}
