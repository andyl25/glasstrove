import React, { useState } from "react";

import Header from "../partials/Header";
import "tailwindcss/tailwind.css";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const SIGNUP = gql`
  mutation Signup(
    $email: String!
    $username: String!
    $password1: String!
    $password2: String!
  ) {
    register(
      email: $email
      username: $username
      password1: $password1
      password2: $password2
    ) {
      success
      errors
    }
  }
`;

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [signup] = useMutation(SIGNUP);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <main className="flex-grow pt-40 w-1/4">
        <div class="form-card text-white card-shadow rounded-md">
          <div class="card-body">
            <div class="mb-3">
              <label for="text-input" class="form-label-sm">
                Email
              </label>
              <input
                class="form-control input-field"
                id="text-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
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
                value={password1}
                onChange={(event) => setPassword1(event.target.value)}
              />
            </div>
            <div class="mb-3">
              <label for="pass-input" class="form-label-sm">
                Re-Enter Password
              </label>
              <input
                class="form-control password input-field"
                id="pass-input"
                value={password2}
                onChange={(event) => setPassword2(event.target.value)}
              />
            </div>
            <button
              type="button"
              class="btn btn-secondary w-full rounded-lg mt-3"
              onClick={() =>
                signup({
                  variables: { email: email, username: username, password1: password1, password2: password2 },
                  onCompleted(data) {
                    console.log(data)
                    if (data.register.success) {
                      router.push("/" + username);
                    }
                  },
                })
              }
            >
              Sign Up
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
