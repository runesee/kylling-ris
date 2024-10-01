import { gql, useLazyQuery } from "@apollo/client";

export const SIGNIN_QUERY = gql`
  query Query($email: String!, $password: String!) {
    userId(email: $email, password: $password)
  }
`;

//Provides a function to log in to a user. Sets userId in local storage. Promised boolean is whether the login was successful or not.
export function useLogin(): (
  email: string,
  password: string
) => Promise<boolean> {
  const [getUserId] = useLazyQuery(SIGNIN_QUERY);

  return (email: string, password: string) =>
    getUserId({
      variables: {
        email,
        password
      }
    }).then((result) => {
      const userId = result.data?.userId;
      if (userId !== null) {
        localStorage.setItem("userId", userId);
      }
      return userId !== null;
    });
}
