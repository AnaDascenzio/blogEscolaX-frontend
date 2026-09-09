import { GlobalStyle } from "./styles/GlobalStyle";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Toaster richColors position="top-right" />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
