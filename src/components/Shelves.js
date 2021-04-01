import { List } from "@material-ui/core";
import ShelvesHeader from "./ShelvesHeader";

import Shelf from "./Shelf";

export default function Shelves({ records, shelves, dispatch }) {
  return (
    <>
      <ShelvesHeader dispatch={dispatch}></ShelvesHeader>
      <List
        style={{
          height: "calc(100vh - 12rem)",
          overflow: "scroll",
        }}
      >
        {Object.values(shelves).map((shelf) => (
          <Shelf
            key={shelf.id}
            records={records}
            shelf={shelf}
            dispatch={dispatch}
          />
        ))}
      </List>
    </>
  );
}
