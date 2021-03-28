import { useState } from "react";
import { TextField } from "@material-ui/core";

export default function Username({ isInvalidUsername, onUsernameChange }) {
  const [input, setInput] = useState("");

  const changeUsername = () => {
    onUsernameChange(input);
  };

  return (
    <>
      <TextField
        label="Pick a Discogs user"
        variant="outlined"
        error={isInvalidUsername}
        helperText={isInvalidUsername ? "Invalid username" : ""}
        size="small"
        onChange={event => setInput(event.target.value)}
        value={input}
      ></TextField>
      <button onClick={changeUsername}>Enter</button>
    </>
  );
}
