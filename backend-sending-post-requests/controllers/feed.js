const { validationResult } = require("express-validator");
const db = require("./firebase"); // adjust path if needed

// GET Posts
exports.getPosts = async (req, res, next) => {
  try {
    const postsSnapshot = await db.collection("posts").get();
    const posts = postsSnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts." });
  }
};

// CREATE Post
exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message:
        "Validation result failed, need to increase the length of the result",
      errors: errors.array(),
    });
  }

  const { title, content } = req.body;

  try {
    const newPost = {
      title,
      content,
      createdAt: new Date().toLocaleDateString(),
      creator: { name: "suman" },
    };

    const postRef = await db.collection("posts").add(newPost);

    res.status(201).json({
      message: "Post created successfully!",
      post: { _id: postRef.id, ...newPost },
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post." });
  }
};
