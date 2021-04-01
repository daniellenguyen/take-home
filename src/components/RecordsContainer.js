import { List, Button } from "@material-ui/core";
import Record from "./Record";
import { Droppable, Draggable } from "react-beautiful-dnd";
import "../App.css";

export default function RecordsContainer({
  currentUsername,
  records,
  shelves,
  dispatch,
  onPaginateClick,
}) {
  return (
    <>
      <h2>{currentUsername}'s Records</h2>
      <Droppable
        droppableId="recordList"
        direction="horizontal"
        isDropDisabled={true}
      >
        {(provided, snapshot) => (
          <List
            className="record-list"
            ref={provided.innerRef}
            style={{
              backgroundColor: "#f5f5f5",
              height: "calc(100vh - 12rem)",
              overflow: "scroll",
            }}
          >
            {records.map((record, index) => (
              <Draggable key={record.id} draggableId={record.id} index={index}>
                {(provided, snapshot) => (
                  <>
                    <span
                      key={record.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Record
                        key={record.id}
                        record={record}
                        shelves={shelves}
                        dispatch={dispatch}
                      />
                    </span>
                    {snapshot.isDragging && (
                      <div>
                        <Record
                          key={record.id}
                          record={record}
                          shelves={shelves}
                          dispatch={dispatch}
                          style={{ display: "none!important" }}
                        />
                      </div>
                    )}
                  </>
                )}
              </Draggable>
            ))}
            <Button
              className="more-button"
              variant="contained"
              onClick={onPaginateClick}
            >
              More
            </Button>
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </>
  );
}
