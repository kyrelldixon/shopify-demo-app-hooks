import Head from "next/head"
import Cookies from "js-cookie"
import ApolloClient from 'apollo-boost';
import { AppProvider } from "@shopify/polaris"
import { Provider } from '@shopify/app-bridge-react';
import { ApolloProvider } from "react-apollo";

import translations from '@shopify/polaris/locales/en.json';

import '@shopify/polaris/styles.css';

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include'
  },
});

const App = ({ Component, pageProps }) => {
  const config = { apiKey: process.env.API_KEY, shopOrigin: Cookies.get("shopOrigin"), forceRedirect: true };

  return (
    <>
      <Head>
        <title>Sample App</title>
        <meta charSet="utf-8" />
      </Head>
      <Provider config={config}>
        <AppProvider i18n={translations}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </AppProvider>
      </Provider>
    </>
  )
}

export default App