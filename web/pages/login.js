import React, { useState } from "react";

import Header from "../partials/Header";
import "tailwindcss/tailwind.css";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { Mixpanel } from "../utils/Mixpanel";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok,
      user{
        id,
        username,
      }
    }
  }
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [login] = useMutation(LOGIN);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <main className="flex-grow pt-40 w-1/4">
        <div class="form-card text-white card-shadow rounded-md">
          <div class="card-body">
            <div class="mb-3">
              <label for="text-input" class="form-label-sm">
                Username
              </label>
              <input
                class="form-control input-field"
                id="text-input"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div class="mb-3">
              <label for="pass-input" class="form-label-sm">
                Password
              </label>
              <input
                class="form-control password input-field"
                id="pass-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button
              type="button"
              class="btn btn-secondary w-full rounded-lg mt-3"
              onClick={() =>
                login({
                  variables: { username: username, password: password },
                  onCompleted(data) {
                    if (data.login.ok) {
                      Mixpanel.identify(data.login.user.id);
                      Mixpanel.track("Successful Login", {username: username});
                      Mixpanel.people.set({username: username})              
                      router.push("/" + data.login.user.username);
                    }
                    else{
                      setHasError(true)
                    }
                  },
                })
              }
            >
              Log In
            </button>
            {hasError && <div class="add-padding font-bold text-red-400">Incorrect username or password. </div> }
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
