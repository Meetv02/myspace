import {
    FavoriteOutlined,
    FavoriteBorderOutlined
} from "@mui/icons-material";
import React from "react";
import { useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";

const Comment = (commentdata) => {
    const [commentData, setCommentData] = useState(commentdata.commentdata);
    const navigate = useNavigate();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const user = commentData.user[0];
    const userPicturePath = user.picturePath;
    const name = `${user.firstName} ${user.lastName}`;
    const likes = commentData.likes;
    const commentId=commentData._id;
    const userId = commentData.userId;
    const comment = commentData.comment;
    let isLiked = Boolean(likes[JSON.stringify(_id)]);
    const likeCount = Object.keys(likes).length;

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const medium = palette.neutral.medium;

    const patchLike = async () => {
        const response = await fetch(`http://localhost:3001/comment/${commentId}/like`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: _id })
        })
        const commentRes=await response.json();
        setCommentData({...commentData,likes:commentRes.likes});
        isLiked = !isLiked;
    } 

    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={userPicturePath} size="40px" />
                <Box
                    onClick={() => {
                        navigate(`/profile/${userId}`);
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer"
                            }
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize="1rem">
                        {comment}
                    </Typography>
                </Box>
            </FlexBetween>
            <Box textAlign="center" gap="1rem" mb="0.5rem">
                <IconButton onClick={patchLike}>
                    {isLiked ? (
                        <FavoriteOutlined sx={{ color: primary }} />
                    ) : (
                        <FavoriteBorderOutlined />
                    )}
                </IconButton>
                <Typography>{likeCount}</Typography>
            </Box>
        </FlexBetween>
    );
};

export default Comment;