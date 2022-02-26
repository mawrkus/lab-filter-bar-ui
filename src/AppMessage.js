import { memo } from "react";
import { Message } from "semantic-ui-react";

export const AppMessage = ({ stateId, filters }) => {
  return (
    <Message size="mini" style={{ marginTop: '24px', boxShadow: 'none' }}>
      <Message.Header>Filters in state "{stateId}" ({filters.length})</Message.Header>
      <Message.List as="ol">
        {filters.map((filter) => (
          <Message.Item key={filter.id}>{JSON.stringify(filter)}</Message.Item>
        ))}
      </Message.List>
    </Message>
  );
};

export default memo(AppMessage);
