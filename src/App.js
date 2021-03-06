import { useCallback, useEffect, useReducer, useState } from "react";

import { Container, Grid } from "@material-ui/core";

import { DragDropContext } from "react-beautiful-dnd";

import { reducer } from "./reducer";

import RecordsContainer from "./components/RecordsContainer";
import Shelves from "./components/Shelves";
import Username from "./components/Username";

export default function App() {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("blacklight");
  const [isInvalidUsername, setIsInvalidUsername] = useState(false);

  const [shelves, dispatch] = useReducer(reducer, {});

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;

      if (!destination) {
        return;
      }

      if (source.droppableId === "recordList") {
        dispatch({
          type: "addRecordToShelf",
          shelfId: destination.droppableId,
          recordId: result.draggableId,
        });
      } else if (source.droppableId === destination.droppableId) {
        dispatch({
          type: "reorderInShelf",
          shelfId: source.droppableId,
          oldIndex: source.index,
          newIndex: destination.index,
        });
      } else {
        dispatch({
          type: "moveBetweenShelves",
          oldShelf: source.droppableId,
          newShelf: destination.droppableId,
          oldIndex: source.index,
          newIndex: destination.index,
          recordDraggableId: result.draggableId
        });
      }
    },
    [dispatch]
  );

  const fetchNextPage = useCallback(() => {
    if (totalNumberOfPages === null || currentPage < totalNumberOfPages) {
      fetch(
        `https://api.discogs.com/users/${currentUsername}/collection/folders/0/releases?page=${currentPage}&per_page=5`
      )
        .then((resp) => resp.json())
        .then((json) => {
          const message = json?.message;
          if (message === "User does not exist or may have been deleted.") {
            // handle username error here because catch won't catch 4xx and 5xx errors
            setIsInvalidUsername(true);
            setRecords([]);
            return;
          } else {
            if (totalNumberOfPages === null) {
              setTotalNumberOfPages(json.pagination?.pages);
            }
            json.releases.forEach((release) => {
              const { id, basic_information: info } = release;
              setRecords((previousRecords) => {
                const next = JSON.parse(JSON.stringify(previousRecords));
                next.push({
                  id: `${id}`,
                  title: info.title,
                  formats: info.formats.map((format) => format.name),
                  label: info.labels?.[0]?.name ?? "",
                  artists: info.artists.map((artist) => artist.name),
                  date: info.year,
                });
                return next;
              });
            });
          }
        });
    }
  }, [currentPage, totalNumberOfPages, currentUsername]);

  const handleOnPaginateClick = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const handleUsernameChange = useCallback((username) => {
    setIsInvalidUsername(false);
    setCurrentPage(1);
    setRecords([]);
    setTotalNumberOfPages(null);
    setCurrentUsername(username);
  }, []);

  useEffect(() => {
    fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentUsername]); // run fetchNextPage on first render or when current username changes

  return (
    <Container>
      <h1>Record Shelves App</h1>
      <Username
        isInvalidUsername={isInvalidUsername}
        onUsernameChange={handleUsernameChange}
      ></Username>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <RecordsContainer
              currentUsername={currentUsername}
              records={records}
              shelves={shelves}
              dispatch={dispatch}
              onPaginateClick={handleOnPaginateClick}
            />
          </Grid>
          <Grid item xs={9}>
            <Shelves records={records} shelves={shelves} dispatch={dispatch} />
          </Grid>
        </Grid>
      </DragDropContext>
    </Container>
  );
}
