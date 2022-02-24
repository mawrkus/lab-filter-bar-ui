import "./App.css";
import { Form, Header, Message } from "semantic-ui-react";
import { FilterBar } from "./components/FilterBar";
import { buildAppStateMachine } from "./state";
import { useMemo, useState } from "react";

// import { initFilters } from "./initFilters";
const initFilters = [];

export const App = () => {
  const [currentFilters, setCurrentFilters] = useState(initFilters);

  const appStateMachine = useMemo(() => buildAppStateMachine({
    initFilters,
    onUpdateFilters: (newFilters, event) => {
      console.log('🧪 Filters update: "%s"', event.action, JSON.stringify(event));
      setCurrentFilters(newFilters);
    },
  }), []);

  return (
    <div className="container">
      <Header as='h1'>🧪 Rick &amp; Morty filter bar 🧪</Header>

      <Form style={{ marginTop: '42px' }}>
        <FilterBar stateMachine={appStateMachine} />
      </Form>

      <Message size="mini" style={{ marginTop: '24px', boxShadow: 'none' }}>
        <Message.Header>Filters ({currentFilters.length})</Message.Header>
        <Message.List as="ol">
          {currentFilters.map((filter) => (
            <Message.Item key={filter.id}>{JSON.stringify(filter)}</Message.Item>
          ))}
        </Message.List>
      </Message>
    </div>
  );
};

export default App;
