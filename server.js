const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = () => {
  return mongoose.connect(
    "mongodb+srv://dhaval:dhaval_123@cluster0.ljuvz.mongodb.net/web15-atlas?retryWrites=true&w=majority"
  );
};

const sectionSchema = new mongoose.Schema(
  {
    section: { type: String, require: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("section", sectionSchema);

const booksSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    body: { type: String, required: true },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
      required: true,
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const Post = mongoose.model("books", booksSchema);

const commentSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },

    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Comment = mongoose.model("author", commentSchema);

app.post("/section", async (req, res) => {
  try {
    const user = await User.create(req.body);

    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/section", async (req, res) => {
  try {
    const users = await User.find().lean().exec();

    return res.send(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/section/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().exec();

    if (user) {
      return res.send(user);
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/section/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/section/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean().exec();

    res.send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/book", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({ path: "section_id", select: "section" })
      .lean()
      .exec();

    return res.send(posts);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post("/book", async (req, res) => {
  try {
    const posts = await Post.create(req.body);

    return res.send(posts);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/book/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean().exec();

    return res.send(post);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/book/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.send(post);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/book/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id).lean().exec();

    return res.send(post);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/author", async (req, res) => {
  try {
    const comments = await Comment.find()

      .populate({
        path: "book_id",
        populate: { path: "section_id" },
      })

      .lean()
      .exec();

    return res.send(comments);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post("/author", async (req, res) => {
  try {
    const comment = await Comment.create(req.body);

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/author/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).lean().exec();

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/author/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/author/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id)
      .lean()
      .exec();

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.listen(5000, async function () {
  try {
    ``;
    await connect();
    console.log("listening on port 5000");
  } catch (e) {
    console.log(e.message);
  }
});
