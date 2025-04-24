const { validationResult } = require("express-validator");
const { db, bucket } = require("./firebase"); // adjust path if needed

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
    const error = new Error(
      "Validation result failed, need to increase the length of the result"
    );
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  let imageUrl = null;
  try {
    if (req.file) {
      const fileName = `${new Date()}-${req.file.originalName.replace(
        /\s+/g,
        "_"
      )}`;
      const file = bucket.file(`posts/${fileName}`);
      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
      stream.on("error", (err) => {
        console.error("Upload error:", err);
        throw err;
      });

      stream.end(req.file.buffer);

      await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2030",
      });

      imageUrl = url;
    }
    const newPost = {
      title,
      content,
      imageUrl,
      createdAt: new Date().toLocaleDateString(),
      creator: { name: "suman" },
    };

    const postRef = await db.collection("posts").add(newPost);

    res.status(201).json({
      message: "Post created successfully!",
      post: { _id: postRef.id, ...newPost },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
// get single post
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  // console.log(postId);
  try {
    const docRef = db.collection("posts").doc(postId);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(400).json({ message: "Post not found" });
    }
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch the data", error: error.message });
  }
};
