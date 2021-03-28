import { useCallback, useEffect, useReducer, useState } from 'react';

import { Container, Grid } from '@material-ui/core';

import { DragDropContext } from 'react-beautiful-dnd';

import { reducer } from './reducer';

import RecordsContainer from './components/RecordsContainer';
import Shelves from './components/Shelves';

export default function App() {
  const [records, setRecords] = useState([]);
  const [nextPage, setNextPage] = useState(1);

  const [shelves, dispatch] = useReducer(reducer, {});

  const onDragEnd = useCallback(
    result => {
      const { source, destination } = result;

      if (!destination) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        dispatch({
          type: 'reorderInShelf',
          shelfId: source.droppableId,
          oldIndex: source.index,
          newIndex: destination.index,
        });
      } else {
        dispatch({
          type: 'moveBetweenShelves',
          oldShelf: source.droppableId,
          newShelf: destination.droppableId,
          oldIndex: source.index,
          newIndex: destination.index,
        });
      }
    },
    [dispatch],
  );

  const fetchNextPage = useCallback(() => {
    const currentRecordList = JSON.parse(JSON.stringify(records))
    // debugger
    fetch(
      `https://api.discogs.com/users/blacklight/collection/folders/0/releases?page=${nextPage}&per_page=5`,
    )
      .then(resp => resp.json())
      .then(json => {
        const totalNumOfPages = json.pagination?.pages
        const currentPage = json.pagination?.page
        if (currentPage < totalNumOfPages) {
          setNextPage(currentPage + 1)
        }

        json.releases.forEach(release => {
          const { id, basic_information: info } = release;
          currentRecordList.push({
            id: `${id}`,
            title: info.title,
            formats: info.formats.map(format => format.name),
            label: info.labels?.[0]?.name ?? '',
            artists: info.artists.map(artist => artist.name),
            date: info.year,
          })
        })
        setRecords(currentRecordList);
      });
  }, [nextPage, records])

  useEffect(() => {
    fetchNextPage()
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
