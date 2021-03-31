import {
  Button,
  Card,
  CardActions,
  CardContent,
  ListItem,
} from "@material-ui/core";

export default function Record({ record, shelf, shelves, dispatch }) {
  return (
    <ListItem key={record.id}>
      <Card style={{ width: "260px" }} data-testid="record">
        <CardContent>
          <p>Title: {record.title}</p>
          <p>Artist(s):{record.artists.join(", ")}</p>
          <p>Label: {record.label}</p>
          <p>Formats: {record.formats.join(", ")}</p>
        </CardContent>

        <CardActions>
          {shelf && (
            <Button
              onClick={() =>
                dispatch({
                  type: "removeRecordFromShelf",
                  shelfId: shelf.id,
                  recordId: record.id,
                })
              }
            >
              Remove
            </Button>
          )}
        </CardActions>
      </Card>
    </ListItem>
  );
}