import { useCallback, useEffect, useReducer, useState } from "react";

import { Container, Grid } from "@material-ui/core";

import { DragDropContext } from "react-beautiful-dnd";

import { reducer } from "./reducer";

import RecordsContainer from "./components/RecordsContainer";
import Shelves from "./components/Shelves";

export default function App() {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(null);

  const [shelves, dispatch] = useReducer(reducer, {});

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;

      if (!destination) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
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
        });
      }
    },
    [dispatch]
  );

  const fetchNextPage = useCallback(() => {
    if (totalNumberOfPages === null || currentPage < totalNumberOfPages) {
      fetch(
        `https://api.discogs.com/users/blacklight/collection/folders/0/releases?page=${currentPage}&per_page=5`
      )
        .then((resp) => resp.json())
        .then((json) => {
          setCurrentPage(json.pagination?.page + 1);
          if (totalNumberOfPages === null) {
            setTotalNumberOfPages(json.pagination?.pages);
          }

          json.releases.forEach((release) => {
            const { id, basic_information: info } = release;
            setRecords((previousRecords) => {
              const next = JSON.parse(JSON.stringify(previousRecords))
              next.push({
                id: `${id}`,
                title: info.title,
                formats: info.formats.map((format) => format.name),
                label: info.labels?.[0]?.name ?? "",
                artists: info.artists.map((artist) => artist.name),
                date: info.year,
              });
              return next
            });
          });
        });
    }
  }, [currentPage, totalNumberOfPages]);

  useEffect(() => {
    fetchNextPage();
  }, []); // I want to run only once, so no dependency array

  return (
    <Container>
      <h1>Record Shelves App</h1>

      <Grid container spacing={3}>
        <Grid item xs={3}>
          <RecordsContainer
            records={records}
            shelves={shelves}
            dispatch={dispatch}
            onPaginateClick={fetchNextPage}
          />
        </Grid>

        <Grid item xs={9}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Shelves records={records} shelves={shelves} dispatch={dispatch} />
          </DragDropContext>
        </Grid>
      </Grid>
    </Container>
  );
}
