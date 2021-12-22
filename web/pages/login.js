import React, { useState } from "react";

import Header from "../partials/Header";
import "tailwindcss/tailwind.css";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
    }
  }
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useMutation(LOGIN);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <main className="flex-grow pt-40 w-1/4">
        <div class="card text-white bg-dark card-shadow">
          <div class="card-body">
            <div class="mb-3">
              <label for="text-input" class="form-label-sm">
                Username
              </label>
              <input
                class="form-control"
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
                class="form-control password"
                id="pass-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button
              type="button"
              class="btn btn-secondary w-full"
              onClick={() =>
                login({
                  variables: { username: username, password: password },
                  onCompleted(data) {
                    if (data.login.ok) {
                      router.push("/" + username);
                    }
                  },
                })
              }
            >
              Log In
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
