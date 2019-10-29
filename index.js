const express = require("express");
const server = express();
const port = 8000;
const db = require("./data/db");
server.use(express.json());

server.get("/api/posts", getAllPosts);
server.post("/api/posts", addPost)

function getAllPosts(req, res) {
  db.find()
    .then(posts => {
      //console.log(posts)
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        messageError: "The posts information could not be retrieved."
      });
    });
}

function addPost(req, res){
  
  db.insert(post).then().catch()
}

server.listen(port, () => {
  console.log(`<- Listening on port ${port} ->`);
});
