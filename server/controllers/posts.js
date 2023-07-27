import Post from "../models/Post.js";
import User from "../models/User.js"

//create
export const createPost = async(req,res) => {
    try {
        const {userId, description } = req.body;
        const picturePath = req.file.filename;
        const user = await User.findById({_id:userId});
        const newPost = new Post({
            userId,
            firstName : user.firstName,
            lastName : user.lastName,
            location : user.location,
            description,
            userPicturePath : user.picturePath,
            picturePath,
            likes : {},
            comments: 0
        });

        await newPost.save();

        const post  = await Post.find();

        res.status(201).json(post);
    } catch (error) {
        res.status(409).json({message : error.message});
    }
}

//read
export const getFeedPosts = async (req,res) => {
    try {
        const posts  = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({message : error.message});
    }
}

export const getUserPosts = async (req,res) => {
    try {
        const userId = req.params.userId;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({message : error.message});
    }
}

//update
export const likePost = async (req,res) => {
    try {
        const id = req.params.id;
        const userId = req.body.userId;
        const post = await Post.findOne({_id:id});
        const isLiked = post.likes.get(JSON.stringify(userId));
        if(isLiked) post.likes.delete(JSON.stringify(userId));
        else post.likes.set(JSON.stringify(userId),true);

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes : post.likes},
            {new : true}
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({message : error.message});
    }
}