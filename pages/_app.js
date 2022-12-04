import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/globals.css";

import { Inter } from "@next/font/google";
import { ImageProvider } from "../utils/context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const App = ({ Component, pageProps }) => {
  return (
    <ImageProvider>
      <Layout className={`${inter.variable} font-sans`}>
        <Head>
          <title>Home - AgroScan</title>
        </Head>
        <Component {...pageProps} />
      </Layout>
    </ImageProvider>
  );
};

export default App;
