import "../styles/globals.css";
import { ChakraProvider , extendTheme} from "@chakra-ui/react";

const theme = extendTheme({

  styles: {
    global: {
      body: {
        bg: '#252422',
        color: "#fffcf2",
        fontSize:"20px"

      },
      button: {
        bg:"#eb5e28 !important"
      }
    }
  },
})


function MyApp({ Component, pageProps }) {
  return (

    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
