import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const addComment = async (req,res) => {
    try {
        console.log("body",req.body);
        const id = req.params.id;
        const {userId,comment} = req.body;
        const post = await Post.find({_id:id});
        if(!post)res.status(404).json("post not found");
        if(!userId || !comment)res.status(404).json("No Data Found");
        const commentData = new Comment({
            userId: userId,
            postId: id,
            comment: comment
        })

        const saveData = await commentData.save();
        // const editPost = await Post.updateOne({_id:postId},{
        //     $push: {comments : saveData._id}
        // })

        const editPost = await Post.findByIdAndUpdate({_id: id},{
            $inc: {
                comments: 1
            }},
            {new : true}
        );

        res.status(201).json({
            message: "data saved",
            status: 201,
            data: editPost
        })
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const likeComment = async (req,res) => {
    try {
        const id=req.params.id;
        console.log(req.body);
        const userId = req.body.userId;
        const comment = await Comment.findOne({_id:id});
        console.log(comment, userId);
        const isLiked = comment.likes.get(JSON.stringify(userId));
        if(isLiked)comment.likes.delete(JSON.stringify(userId));
        else comment.likes.set(JSON.stringify(userId),true);
        const updatedComment = await Comment.findByIdAndUpdate({_id:id},
            {likes: comment.likes},
            {new: true}
        );
        
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const getComment = async (req,res) => {
    try {
        const id=req.params.id;
        const comments = await Comment.find({postId:id});
        const commentData =  await Promise.all(comments.map(async (com) => {
            return {
            '_id': com._id,
            'userId': com.userId,
            'comment': com.comment,
            'likes': com.likes,
            'user' : await User.find({_id:com.userId},{firstName:1,lastName:1,picturePath:1}).then((data)=>{
                return data
            })}
        }));
        res.status(200).json(commentData)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}
