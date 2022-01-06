import React, { useState } from "react";

import Header from "../partials/Header";
import "tailwindcss/tailwind.css";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { Mixpanel } from "../utils/Mixpanel";

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

function Signup() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password1, setPassword1] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const [password2, setPassword2] = useState("");
  const [password2Error, setPassword2Error] = useState("");
  const [signup] = useMutation(SIGNUP);
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
                Email
              </label>
              <input
                class="form-control input-field"
                id="text-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {<div class="add-padding font-bold text-red-400">{emailError}</div> }
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
              {<div class="add-padding font-bold text-red-400">{usernameError}</div> }
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
              {<div class="add-padding font-bold text-red-400">{password2Error}</div> }
            </div>
            

            <button
              type="button"
              class="btn btn-secondary w-full rounded-lg mt-3"
              onClick={() =>
                signup({
                  variables: { email: email, username: username, password1: password1, password2: password2 },
                  onCompleted(data) {
                    console.log(data)
                    login({
                      variables: { username: username, password: password1 },
                      onCompleted(data) {
                        if (data.login.ok) {
                          Mixpanel.identify(data.login.user.id);
                          Mixpanel.track("Successful Login", {username: username});
                          Mixpanel.people.set({username: username})              
                          router.push("/" + data.login.user.username);
                        }
                      },
                    })
                    if (data.register.success) {
                      Mixpanel.track("Successful Signup", {email, username})
                      router.push("/" + username);
                    }
                    else{
                      if(data.register.errors.email != null){
                        setEmailError(data.register.errors.email[0].message)
                      }
                      else{
                        setEmailError("")
                      }
                      if(data.register.errors.username != null){
                        setUsernameError(data.register.errors.username[0].message)
                      }
                      else{
                        setUsernameError("")
                      }
                      if(data.register.errors.password2 != null){
                        setPassword2Error(data.register.errors.password2[0].message)
                      }
                      else{
                        setPassword2Error("")
                      }
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
