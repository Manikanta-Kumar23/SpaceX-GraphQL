import React from "react"
import { ApolloClient , InMemoryCache , ApolloProvider } from '@apollo/client';
import {  offsetLimitPagination } from "@apollo/client/utilities";

import Home from './components/Home/index.tsx';
import './App.css';

const  App = () => {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          launchesPast: offsetLimitPagination()
        }
      }
    }
  })
  const client = new ApolloClient({
    uri: "https://spacex-production.up.railway.app/" ,
    cache
  })
  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  )
}

export default App;
