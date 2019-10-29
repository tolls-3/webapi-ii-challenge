const express = require("express");
const db = require("./db");
const router = express.Router();

router.get("/", getAllPosts);
router.post("/", addPost);
router.post("/:id/comments", addComment);
router.get("/:id", getPostById);
router.get("/:id/comments", getCommentById);
router.delete("/:id", deletePostById);
router.put("/:id", updatePost);

function getAllPosts(req, res) {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        messageError: "The posts information could not be retrieved."
      });
    });
}

function addPost(req, res) {
  const { contents, title } = req.body;
  if (!contents || !title) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    const post = req.body;
    db.insert(post)
      .then(item => {
        res.status(201).json(item.id);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
}

function addComment(req, res) {
  const { id } = req.params;
  const comment = req.body;
  db.findById(id).then(item => {
    if (item.length === 0) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else if (!comment.text) {
      res.status(400).json({
        errorMessage: "Please provide text for the comment."
      });
    } else {
      db.insertComment(comment)
        .then(item => {
          res.status(200).json(item);
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
        });
    }
  });
}

function getPostById(req, res) {
  const id = req.params.id;
  db.findById(id)
    .then(item => {
      if (item.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        res.status(200).json(item);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
}

function getCommentById(req, res) {
  const id = req.params.id;
  db.findById(id)
    .then(item => {
      if (item.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        db.findPostComments(req.params.id)
          .then(comments => {
            res.status(200).json(comments);
          })
          .catch(error => {
            res.status(500).json(error);
          });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
}

function deletePostById(req, res) {
  const id = req.params.id;
  db.findById(id).then(item => {
    if (item.length === 0) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else {
      db.remove(req.params.id)
        .then(comments => {
          res.status(200).json(comments);
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            error: "The comments information could not be retrieved."
          });
        });
    }
  });
}

function updatePost(req, res) {
  const id = req.params.id;
  const { title, contents } = req.body;
  db.findById(id).then(item => {
    if (item.length === 0) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else if (!title || !contents) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      });
    } else {
      db.update(id, req.body)
        .then(item => {
          res.status(200).json(item);
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            error: "The post information could not be modified."
          });
        });
    }
  });
}

module.exports = router;
