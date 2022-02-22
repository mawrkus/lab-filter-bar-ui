import "./App.css";
import { Form, Message } from "semantic-ui-react";
import { FilterBar } from "./components/FilterBar";
import { buildAppStateMachine } from "./state";
import { useMemo, useState } from "react";

const initFilters = [];

// const initFilters = [
//   {
//     id: 1,
//     attribute: { id: 2, value: "season", label: "Season" },
//     operator: { id: 2, value: "!=", label: "!=" },
//     value: { id: 118549, value: 5, label: "5 (10 episodes)" },
//     type: "attribute-operator-value",
//   },
//   {
//     id: 2,
//     attribute: null,
//     operator: { id: 1, value: "and", label: "AND" },
//     value: null,
//     type: "logical-operator",
//   },
//   {
//     id: 3,
//     attribute: { id: 3, value: "episode", label: "Episode" },
//     operator: { id: 1, value: "=", label: "=" },
//     value: {
//       id: 2127407,
//       value: "Rick & Morty's Thanksploitation Spectacular",
//       label: "Rick & Morty's Thanksploitation Spectacular (S5E6)",
//     },
//     type: "attribute-operator-value",
//   },
// ];

export const App = () => {
  const [currentFilters, setCurrentFilters] = useState(initFilters);

  const appStateMachine = useMemo(() => buildAppStateMachine({
    initFilters,
    onUpdateFilters: (newFilters, event) => {
      console.log('🧪 Filters update: "%s"', event.action, event);
      setCurrentFilters(newFilters);
    },
  }), []);

  return (
    <div className="container">
      <h2 className="title">🧪 Rick &amp; Morty filter bar 🧪</h2>

      <Form>
        <FilterBar stateMachine={appStateMachine} />
      </Form>

      <Message size="mini" style={{ marginTop: '24px' }}>
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
