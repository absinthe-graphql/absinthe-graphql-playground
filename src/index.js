import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Playground, store } from "graphql-playground-react";

import { Socket as PhoenixSocket } from "phoenix";
import * as AbsintheSocket from "@absinthe/socket";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";

import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";

const absintheLinkCreator = (session, subscriptionEndpoint) => {
  let connectionParams = {};
  const { headers, credentials } = session;

  if (headers) {
    connectionParams = { ...headers };
  }

  const httpLink = new HttpLink({
    uri: session.endpoint,
    headers,
    credentials
  });

  if (!subscriptionEndpoint) {
    return { link: httpLink };
  }

  const absintheSocketLink = createAbsintheSocketLink(
    AbsintheSocket.create(
      new PhoenixSocket(subscriptionEndpoint, {
        timeout: 20000,
        params: connectionParams
      })
    )
  );

  return {
    link: new ApolloLink.split(
      operation => hasSubscription(operation.query),
      absintheSocketLink,
      httpLink
    )
  };
};

export default {
  init: ({ endpoint, subscriptionEndpoint = null }) => {
    ReactDOM.render(
      <Provider store={store}>
        <Playground
          endpoint={endpoint}
          subscriptionEndpoint={subscriptionEndpoint}
          createApolloLink={absintheLinkCreator}
        />
      </Provider>,
      document.getElementById("app")
    );
  }
};
