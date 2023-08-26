import { memo } from "react";
import { Message, Button } from "semantic-ui-react";

export const AppMessage = ({ stateId, filters }) => {
  return (
    <Message size="tiny" style={{ marginTop: "42px", boxShadow: "none" }}>
      <Message.Header
        as="h1"
        style={{ display: "flex", alignItems: "center" }}
      >
        <span>
          Filters in "{stateId}" state ({filters.length})
        </span>

        <Button
          as="a"
          target="_blank"
          circular
          icon="linkify"
          size="mini"
          style={{ marginLeft: "12px", fontSize: "8px" }}
          title="Open in new tab"
          href={window.location.href}
        />

        <Button
          as="a"
          circular
          icon="trash alternate outline"
          size="mini"
          style={{ fontSize: "8px" }}
          title="Reset all filters"
          href="/"
        />
      </Message.Header>

      <Message.List as="ol">
        {filters.map((filter) => (
          <Message.Item key={filter.id}>{JSON.stringify(filter)}</Message.Item>
        ))}
      </Message.List>
    </Message>
  );
};

export default memo(AppMessage);
