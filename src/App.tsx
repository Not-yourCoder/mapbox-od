import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import MainPage from "./pages/main/page";

const client = new QueryClient()
function App() {
  return (
    <div>
      <QueryClientProvider client={client}>
        <MainPage />
      </QueryClientProvider>
    </div>
  );
}

export default App;
