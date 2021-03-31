import { uuid } from 'uuidv4';

let shelfIdCounter = 0;

export const reducer = (state, action) => {
  switch (action.type) {
    case "createShelf":
      const id = `shelf-${shelfIdCounter}`;
      shelfIdCounter++;
      return {
        ...state,
        [id]: {
          id,
          name: action.name,
          records: [],
        },
      };
    case "deleteShelf":
      return Object.entries(state).reduce((newState, [id, value]) => {
        if (id !== action.id) {
          newState[id] = value;
        }
        return newState;
      }, {});
    case "renameShelf":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          name: action.name,
        },
      };
    case "addRecordToShelf":
      const newRecordList = [...state[action.shelfId].records]
      if (state[action.shelfId].records.find((record) => record.id === action.recordId)) {
        return {
          ...state,
          [action.shelfId]: {
            ...state[action.shelfId],
            duplicateErrorHappened: true,
          },
        };
      } else {
        // create a new separate draggableId for a record once it's added to shelf
        newRecordList.push({id: action.recordId, draggableId: uuid()})
        return {
          ...state,
          [action.shelfId]: {
            ...state[action.shelfId],
            records: newRecordList,
          },
        };
      }
    case "clearDuplicateRecordError":
      return {
        ...state,
        [action.shelfId]: {
          ...state[action.shelfId],
          duplicateErrorHappened: false,
        },
      };
    case "removeRecordFromShelf":
      return {
        ...state,
        [action.shelfId]: {
          ...state[action.shelfId],
          records: state[action.shelfId].records.filter(
            (record) => record.id !== action.recordId
          ),
        },
      };
    case "reorderInShelf":
      const newOrder = [...state[action.shelfId].records];
      const [record] = newOrder.splice(action.oldIndex, 1);
      newOrder.splice(action.newIndex, 0, record);
      return {
        ...state,
        [action.shelfId]: {
          ...state[action.shelfId],
          records: newOrder,
        },
      };
    case "moveBetweenShelves":
      const newShelf = [...state[action.newShelf].records];
      if (newShelf.find((record) => record.id === action.recordId)) {
        return {
          ...state,
          [action.newShelf]: {
            ...state[action.newShelf],
            records: newShelf,
            duplicateErrorHappened: true,
          },
        };
      } else {
        newShelf.splice(
          action.newIndex,
          0,
          state[action.oldShelf].records[action.oldIndex]
        );

        return {
          ...state,
          [action.oldShelf]: {
            ...state[action.oldShelf],
            records: state[action.oldShelf].records.filter(
              (record, index) => index !== action.oldIndex
            ),
          },
          [action.newShelf]: {
            ...state[action.newShelf],
            records: newShelf,
          },
        };
      }
    default:
      throw new Error();
  }
};
