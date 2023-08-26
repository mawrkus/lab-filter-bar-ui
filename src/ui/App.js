import "./App.css";

import { useMemo, useState } from "react";
import { Form, Header } from "semantic-ui-react";

import { FilterBar } from "./FilterBar";
import { buildAppStateMachine } from "../domain";
import { useFiltersFromUrl } from "./hooks";
import { AppMessage } from "./AppMessage";

export const App = () => {
  const [filters, setFilters] = useFiltersFromUrl();
  const [stateId, setStateId] = useState(null);

  const appStateMachine = useMemo(
    () =>
      buildAppStateMachine({
        initFilters: filters,
        onTransition: (transition) => {
          if (transition.toStateId) {
            setStateId(transition.toStateId);
          }
        },
        onUpdateFilters: (newFilters, event) => {
          const { action, filter, prevFilter, part } = event;

          if (action === "edit") {
            console.log(
              '🧪 %s "%s" filter\'s %s',
              action,
              prevFilter.type,
              part
            );
            console.log("  🔎 %o → %o", prevFilter[part], filter[part]);
          } else {
            console.log('🧪 %s "%s" filter', action, filter.type);
            console.log("  🔎", filter);
          }

          setFilters(newFilters);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }),
    []
  );

  return (
    <div className="container">
      <Header as="h1" dividing>
        🧪 Rick &amp; Morty filter bar 🧪
      </Header>

      <Form style={{ marginTop: "42px" }}>
        <FilterBar stateMachine={appStateMachine} />
      </Form>

      <AppMessage stateId={stateId} filters={filters} />
    </div>
  );
};

export default App;
