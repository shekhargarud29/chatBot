// import logo from './logo.svg';
import "./App.css";
import { Body } from "./component/body";
import { Provider } from "react-redux";
import appStore from "./utils/store";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 500000, // 5 minutes
    },
  },
}); // Create a client

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={appStore}>
          <Body></Body>
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
