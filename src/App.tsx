import React from "react"
import { ApolloClient , InMemoryCache , ApolloProvider } from '@apollo/client';

import Home from './components/Home/index.tsx';
import './App.css';

const  App = () => {
  const client = new ApolloClient({
    uri: "https://spacex-production.up.railway.app/" ,
    cache: new InMemoryCache()
  })
  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  )
}

export default App;
