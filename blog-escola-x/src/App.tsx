import "./App.css";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
