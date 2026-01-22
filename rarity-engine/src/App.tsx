import { RarityProvider } from './context/RarityContext';
import RarityApp from './components/RarityApp';
import './index.css';

function App() {
  return (
    <RarityProvider>
      <RarityApp />
    </RarityProvider>
  );
}

export default App;
