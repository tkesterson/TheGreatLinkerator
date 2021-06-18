import React, { useState } from "react";
import { Drawer, TextField, Button } from "@material-ui/core";
import { createNewLink } from "../api/Form";

const Form = ({ links, setLinks }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [comments, setComments] = useState("");
  const [tags, setTags] = useState([]);

  const [open, setOpen] = useState(false);
  function clearInput() {
    setName("");
    setUrl("");
    setComments("");
    setTags([]);
  }
  const nChange = (evt) => {
    evt.preventDefault();
    setName(evt.target.value);
  };
  const uChange = (evt) => {
    evt.preventDefault();
    setUrl(evt.target.value);
  };
  const cChange = (evt) => {
    evt.preventDefault();
    setComments(evt.target.value);
  };
  const tChange = (evt) => {
    evt.preventDefault();
    const tags = evt.target.value;
    const tagsArray = tags.split(/\s+/);
    setTags(tagsArray);
    console.log(tagsArray);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const clickHandler = async (evt) => {
    evt.preventDefault();
    const response = await createNewLink({ name, url, comments, tags });
    if (!response.error) {
      clearInput();
      handleDrawerClose();
      //data from response, ...links, push newLink, setLinks(newArray)
      console.log(response);

      const newArray = [...links, response];

      setLinks(newArray);
    } else {
      alert(response.message);
    }
  };

  return (
    <>
      <Button onClick={handleDrawerOpen} variant="outlined">
        New Link
      </Button>
      <Drawer variant="persistent" anchor="top" open={open}>
        <form>
          <h3>Create New Link.</h3>
          <TextField label="Name" fullWidth value={name} onChange={nChange} />
          <br></br>
          <TextField label="URL" fullWidth value={url} onChange={uChange} />
          <br></br>
          <TextField
            label="Comment"
            fullWidth
            value={comments}
            onChange={cChange}
          />
          <br></br>
          <TextField label="Tags" fullWidth onChange={tChange} />
          <br></br>
          <Button variant="outlined" onClick={clickHandler}>
            Create!
          </Button>
          <Button variant="outlined" onClick={handleDrawerClose}>
            Cancel
          </Button>
        </form>
      </Drawer>
    </>
  );
};
export default Form;
