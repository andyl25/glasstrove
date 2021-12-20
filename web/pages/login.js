import React, { useState, useEffect } from "react";

import Header from "../partials/Header";
import "tailwindcss/tailwind.css";
import { gql, useMutation, useQuery } from "@apollo/client";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
    }
  }
`;

const ME = gql`
  query {
    me {
      username
      following {
        username
      }
      followers {
        username
      }
      numfollowers
      posts {
        id
        title
        imageUrl
        xPos
        yPos
        size
      }
    }
  }
`;
function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useMutation(LOGIN);
  const { loading, error, data } = useQuery(ME);

  useEffect(() => {
    console.log(data);
  })
  
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
                    console.log(data);
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

export default Home;
