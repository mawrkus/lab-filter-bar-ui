
import { Form } from 'semantic-ui-react';

import './App.css';
import { FilterBar } from './FilterBar';

export const App = () => {
  return (
    <div className="container">
      <h2 className="title">🧪 Rick &amp; Morty filter bar 🧪</h2>
      <FilterBar />
    </div>
  );
}

export default App;
