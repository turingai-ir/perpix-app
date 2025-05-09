import { RouterProvider } from "react-router";
import router from "./router/router";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};
const direction = "rtl";

const theme = extendTheme({ config, direction });

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS portalZIndex={100}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
