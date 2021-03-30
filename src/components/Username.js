import { useState, useCallback } from "react";
import { TextField } from "@material-ui/core";

export default function Username({ isInvalidUsername, onUsernameChange }) {
  const [input, setInput] = useState("");

  const changeUsername = useCallback((event) => {
    event.preventDefault() // stop refreshing the page automatically onsubmit
    onUsernameChange(input);
  }, [onUsernameChange, input])

  return (
    <form onSubmit={changeUsername}>
      <TextField
        label="Pick a Discogs user"
        variant="outlined"
        error={isInvalidUsername}
        helperText={isInvalidUsername ? "Invalid username" : ""}
        size="small"
        onChange={event => setInput(event.target.value)}
        value={input}
      ></TextField>
      </form>
  );
}
