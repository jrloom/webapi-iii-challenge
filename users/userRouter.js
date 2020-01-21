const router = require("express").Router();
const userDB = require("./userDb");
const postDB = require("../posts/postDb");

router.post("/", validateUser, (req, res) => {
  userDB
    .insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(err =>
      res
        .status(500)
        .json({ error: "There was an error while adding the user" })
    );
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  postDB
    .insert(req.body)
    .then(post => res.status(201).json(post))
    .catch(err =>
      res.status(500).json({ error: "There was a problem saving this post" })
    );
});

router.get("/", (req, res) => {
  userDB
    .get()
    .then(user => res.status(201).json(user))
    .catch(err =>
      res.status(500).json({ error: "User information not found" })
    );
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  userDB
    .getUserPosts(req.user.id)
    .then(post => {
      post.length > 0
        ? res.status(200).json(post)
        : res.status(404).json({ error: "User hasn't made any posts" });
    })
    .catch(err =>
      res.status(500).json({ error: "We can't find any posts by that user" })
    );
});

router.delete("/:id", validateUserId, (req, res) => {
  userDB
    .remove(req.user.id)
    .then(user => {
      user
        ? res.status(204).json({ message: `User has been removed` })
        : res.status(404).json({ error: `User does not exist` });
    })
    .catch(err => res.status(500).json({ error: "User could not be removed" }));
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  userDB
    .update(req.user.id, req.body)
    .then(user => {
      user
        ? res
            .status(202)
            .json({ message: `User ${req.user.id} has been updated` })
        : res.status(404).json({ error: "User not found" });
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "Cannot modify user information at the moment" })
    );
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;

  userDB
    .getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "User info could not be found" });
    });
}

function validateUser(req, res, next) {
  const { name } = req.body;

  if (!req.body) {
    res.status(400).json({ error: "Missing user information" });
  } else if (!name) {
    res.status(400).json({ error: "Name required" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const text = req.body.text;

  if (!text) {
    res.status(400).json({ error: "Text is required" });
  } else {
    next();
  }
}

module.exports = router;
