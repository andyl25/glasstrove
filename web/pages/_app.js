import App from "next/app";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  createHttpLink,
  // useQuery,
  gql,
} from '@apollo/client';
import "../css/style.scss"

const link = createHttpLink({
  // uri: 'http://0.0.0.0:8000/graphql',
  // credentials: "same-origin",
  uri: "https://countries.trevorblades.com"
});

// const AuthLink = new ApolloLink((operation, forward) => {
//   const token = window.localStorage.getItem("auth_token");
//   operation.setContext({
//     headers: {
//       authorization: token ? `JWT ${token}` : "",
//     },
//   });
//   return forward(operation);
// });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([link]),
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
