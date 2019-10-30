const router = require("express").Router();
const userDB = require("../users/userDb");
const postDB = require("./postDb");

router.get("/", (req, res) => {
  postDB
    .get()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ error: "Post could not be found" }));
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  postDB
    .remove(req.post.id)
    .then(post => {
      res.status(202).json({ message: `Post ${req.post.id} deleted` });
    })
    .catch(err => res.status(500).json({ error: "Could not delete the post" }));
});

router.put("/:id", validatePostId, (req, res) => {
  postDB
    .update(req.post.id, req.body)
    .then(post => {
      if (req.body.text.length > 0) {
        res
          .status(202)
          .json({ message: `Post ${req.post.id} has been updated` });
      } else {
        res.status(400).json({ error: "You'll need to write something first" });
      }
    })
    .catch(err => res.status(500).json({ error: "Could not update the post" }));
});

// custom middleware

function validatePostId(req, res, next) {
  // const id = req.params.id;
  postDB
    .getById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(404).json({ error: "Post not found" });
      } else {
        req.post = post;
        next();
      }
    })
    .catch(err => res.status(500).json({ error: "There were...difficulties" }));
}

module.exports = router;
