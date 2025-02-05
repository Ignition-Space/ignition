import { Provider as JotaiProvider } from 'jotai';
import Router from './router';

function App() {
  return (
    <JotaiProvider>
      <Router />
    </JotaiProvider>
  );
}

export default App;
