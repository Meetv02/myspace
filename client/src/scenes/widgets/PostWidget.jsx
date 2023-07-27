import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, InputBase,Button } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import Comment from "../../components/Comment";

const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
}) => {
    const [isComment, setIsComment] = useState(false);
    const [commentData, setCommentData] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[JSON.stringify(loggedInUserId)]);
    const likeCount = Object.keys(likes).length;
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const setComment = async () => {
        const response = await fetch(`http://localhost:3001/comment/${postId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const commentDataRes = await response.json();
        setCommentData(commentDataRes);
        setIsComment(isComment => !isComment);
    };

    const patchLike = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: loggedInUserId })
        });
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    };

    const handleComment = async () => {
        console.log(loggedInUserId,commentInput);
        const response = await fetch(`http://localhost:3001/comment/add/${postId}`,{
            method: "POST",
            body: JSON.stringify({
                userId: loggedInUserId,
                comment: commentInput
            }),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        });
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost.data })); 
        setCommentInput("");
        setComment();
        setIsComment(isComment => !isComment);
    }

    return (
        <WidgetWrapper m="2rem 0">
            <Friend
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}
            />
            <Typography color={main} sx={{ mt: "1rem" }}>
                {description}
            </Typography>
            {picturePath && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                    src={`http://localhost:3001/assets/${picturePath}`}
                />
            )}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={setComment}>
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography>{comments}</Typography>
                    </FlexBetween>

                </FlexBetween>

                <IconButton>
                    <ShareOutlined />
                </IconButton>

            </FlexBetween>
            {isComment && (
                <Box mt="0.5rem">
                    {commentData.map((commentdata, index) => (
                        <Comment key={index}
                            commentdata={commentdata}
                        />
                    ))}
                    <FlexBetween gap="1rem">
                        <InputBase
                            placeholder="Add Comment..."
                            onChange={(e) => setCommentInput(e.target.value)}
                            value={commentInput}
                            sx={{
                                width: "90%",
                                backgroundColor: palette.neutral.light,
                                borderRadius: "2rem",
                                padding: ".75rem 2rem"
                            }}
                        />
                        <Button
                            onClick={handleComment}
                            sx={{
                                color: palette.background.alt,
                                backgroundColor: palette.primary.main,
                                borderRadius: "3rem"
                            }}
                        >
                            POST
                        </Button>
                    </FlexBetween>
                </Box>
            )}
        </WidgetWrapper>
    );
}

export default PostWidget;
