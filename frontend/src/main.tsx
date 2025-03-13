import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // ✅ Removed .jsx, TypeScript resolves .tsx automatically
import { Provider } from "react-redux";
import store from "./redux/store"; // ✅ Removed .js, TypeScript resolves .ts automatically
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Ensure `root` is not null
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Ensure you have a <div id='root'></div> in index.html");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // ✅ Converted to milliseconds
    },
  },
});

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <SnackbarProvider autoHideDuration={3000}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </SnackbarProvider>
    </Provider>
  </StrictMode>
);
