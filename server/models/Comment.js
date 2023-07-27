import mongoose from "mongoose";
import User from "./User.js";
import Post from "./Post.js";

const commentSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    comment : String,
    likes : {
        type : Map,
        of : Boolean,
        default: {}
    }
},{
    timestamps: true
})

const Comment = mongoose.model("Comment",commentSchema);

export default Comment;
