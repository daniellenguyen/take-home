import { List } from '@material-ui/core';

import Record from './Record';

export default function RecordsContainer({ currentUsername, records, shelves, dispatch, onPaginateClick }) {
  return (
    <>
      <h2>{currentUsername}'s Records</h2>
      <List
        style={{
          backgroundColor: '#f5f5f5',
          height: 'calc(100vh - 12rem)',
          overflow: 'scroll',
        }}
      >
        {records.map(record => (
          <Record
            key={record.id}
            record={record}
            shelves={shelves}
            dispatch={dispatch}
          />
        ))}
        <button onClick={onPaginateClick}>More</button>
      </List>
    </>
  );
}
