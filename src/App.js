import "./App.css";
import { FilterBar } from "./components/FilterBar";
import { buildAppStateMachine } from "./state";

const filters = [
  {
    id: 1,
    attribute: { id: 2, value: "season", label: "Season" },
    operator: { id: 2, value: "!=", label: "!=" },
    value: { id: 118549, value: 5, label: "5 (10 episodes)" },
    type: "attribute-operator-value",
  },
  {
    id: 2,
    attribute: null,
    operator: { id: 1, value: "and", label: "AND" },
    value: null,
    type: "logical-operator",
  },
  {
    id: 3,
    attribute: { id: 3, value: "episode", label: "Episode" },
    operator: { id: 1, value: "=", label: "=" },
    value: {
      id: 2127407,
      value: "Rick & Morty's Thanksploitation Spectacular",
      label: "Rick & Morty's Thanksploitation Spectacular (S5E6)",
    },
    type: "attribute-operator-value",
  },
];

export const App = () => {
  const appStateMachine = buildAppStateMachine({ filters });

  return (
    <div className="container">
      <h2 className="title">🧪 Rick &amp; Morty filter bar 🧪</h2>
      <FilterBar stateMachine={appStateMachine} />
    </div>
  );
};

export default App;
