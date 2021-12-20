import App from "next/app";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  createHttpLink,
  // useQuery,
  gql,
} from "@apollo/client";
import "../css/style.scss";
import "../css/theme.css";
import cookie from "react-cookies";

const link = createHttpLink({
  uri: "/graphql",
  credentials: "same-origin",
  // uri: "https://countries.trevorblades.com"
});

const AuthLink = new ApolloLink((operation, forward) => {
  let token = cookie.load("csrftoken");
  if (token === undefined || token === null) {
    fetch(`/csrf`, {
      credentials: "include",
    }).then((response) => {
      token = response.json().csrfToken;
      operation.setContext({
        headers: {
          "X-CSRFToken": token,
        },
      });
      return forward(operation);
    });
  } else {
    operation.setContext({
      headers: {
        "X-CSRFToken": token,
      },
    });
    return forward(operation);
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([AuthLink, link]),
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
}

export default MyApp;
