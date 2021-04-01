import { useCallback, useState } from "react";

import { Button, Input } from "@material-ui/core";
import "../App.css"

export default function ShelvesHeader({ dispatch }) {
  const [adding, setAdding] = useState(false);
  const [inputName, setInputName] = useState("");

  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      dispatch({ type: "createShelf", name: inputName });
      setAdding(false);
      setInputName("");
      return false;
    },
    [dispatch, inputName]
  );

  return (
    <div>
      <h2 className="shelves-label">Shelves</h2>
      {adding ? (
        <form className="input-shelf-name" onSubmit={handleSubmit}>
          <Input
            inputProps={{
              "data-testid": "add-shelf",
            }}
            value={inputName}
            onChange={(evt) => setInputName(evt.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            style={{ marginLeft: "1rem" }}
          >
            Submit
          </Button>
        </form>
      ) : (
        <Button className="add-shelf-button" variant="contained" onClick={() => setAdding(true)}>
          Add Shelf
        </Button>
      )}
    </div>
  );
}