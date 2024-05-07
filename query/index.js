const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  switch (type) {
    case "PostCreated": {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }
    case "CommentCreated": {
      const { id, postId, content, status } = data;
      posts[postId].comments.push({ id, content, status });
      break;
    }
    case "CommentUpdated": {
      const { id, content, postId, status } = data;
      const post = posts[postId];
      const comment = post.comments.find((comment) => {
        return comment.id === id;
      });
      comment.content = content;
      comment.status = status;
      console.log(comment);
      break;
    }
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  console.log("Recieved event: ", req.body.type);
  res.send({ status: "OK" });
});

app.listen(4002, async () => {
  console.log("listening on 4002");
  const { data } = await axios.get("http://event-bus-srv:4005/events");
  for (let event of data) {
    console.log("Processing event:", event.type);
    handleEvent(event.type, event.data);
  }
});
