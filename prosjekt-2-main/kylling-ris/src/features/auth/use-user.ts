import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User } from "./user";

//Provides either the info about the user that is logged in, or provides a generated guest user. Either way, the userId is stored in localhost and can be used when querying.
export function useUser(): { user: User; logOut: () => void } {
  const [createGuest] = useMutation(gql`
    mutation CreateGuest {
      createGuest
    }
  `);

  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      // two guests get created in dev mode because of <React.StrictMode>
      createGuest().then((response) => {
        if (localStorage.getItem("userId") === null) {
          localStorage.setItem("userId", response.data?.createGuest);
        }
      });
    }
  }, [createGuest]);

  const { data, refetch } = useQuery(gql`
    query User {
      user {
        name
        email
      }
    }
  `);

  //Updates user info when registerpage and loginpage navigate to mainpage
  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  return {
    user: data === undefined || data === null ? null : data.user,
    logOut: () => {
      createGuest().then((response) => {
        localStorage.setItem("userId", response.data?.createGuest);
        refetch();
      });
    }
  };
}
