import { memo } from "react";
import { Message, Button } from "semantic-ui-react";

export const AppMessage = ({ stateId, filters }) => {
  return (
    <Message size="tiny" style={{ marginTop: "24px", boxShadow: "none" }}>
      <Message.Header style={{ display: "flex" }}>
        <span>
          Filters in "{stateId}" state ({filters.length})
        </span>

        <Button
          as="a"
          target="_blank"
          circular
          icon="linkify"
          size="mini"
          style={{ marginLeft: "10px", fontSize: "7px" }}
          title="Open in new tab"
          href={`/?filters=${encodeURIComponent(JSON.stringify(filters))}`}
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
