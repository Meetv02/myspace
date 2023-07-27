import { Box, useMediaQuery } from '@mui/material';
import React, { useEffect } from 'react';
import Navbar from '../navbar/index'
import { useDispatch, useSelector } from 'react-redux';
import UserWidget from '../widgets/UserWidgets';
import MyPostWidget from '../widgets/MyPostWidget';
import PostsWidget from '../widgets/PostsWidget';
import FriendListWidget from '../widgets/FriendListWidget';
import { setUsers } from '../../state';

const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { _id, picturePath } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const getAllUser = async () => {
        const response = await fetch("http://localhost:3001/users/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        dispatch(setUsers({ users: data }));
    }
    useEffect(() => {
        getAllUser();
    }, [])

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget userId={_id} picturePath={picturePath} />
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <MyPostWidget picturePath={picturePath} />
                    <PostsWidget userId={_id} />
                </Box>
                {isNonMobileScreens && <Box flexBasis="26%">
                    <FriendListWidget userId={_id} />
                </Box>}
            </Box>
        </Box>
    );
};

export default HomePage