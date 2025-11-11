import Post from "../models/post.model.js";

export const createPost = async (req, res)  => {
  const { content, image } = req.body;

  if(!content) {
    return res.status(400).json({ success: false, message: 'content cannot be empty' });
  }
  try {
    const userId = req.user.id;
    const newPost = await Post.create({
      user: userId,
      content,
      image
    });
    
    console.log(`Post created successfully: ${newPost}`);
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    console.error(`Error creating the post: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    console.log(`Posts: ${posts}`);
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(`Error fetching posts: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const toggleLikePost = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if(!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(userId);
    if(alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ success: true, likes: post.likes.length });
  } catch (error) {
    console.error(`Error in liking post: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const addComment = async (req, res) => {
  const userId = req.user.id;
  const { text } = req.body;
  const { id } = req.params;

  if(!text.trim()) {
    return res.status(400).json({ success: false, message: 'Text is required' });
  }

  try {
    const post = await Post.findById(id);
    if(!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = { user: userId, text, createdAt: new Date() };
    post.comments.push(comment);
    await post.save();

    res.status(201).json({ success: true, comments: post.comments })
  } catch (error) {
    console.error(`Error in adding comment: ${error.message }`);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const editPost = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if(!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if(post.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    post.content = req.body.content || post.content;
    post.image = req.body.image || post.image;

    await post.save();
    
    res.status(200).json({ success: true, message: 'Post updated successfully', post });
  } catch (error) {
    console.error(`Error in editing post: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const deletePost = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if(!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if(post.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error(`Error in deleting post: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}