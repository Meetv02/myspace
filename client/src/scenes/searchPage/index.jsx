import { Box, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/index'
import { useSelector } from 'react-redux';
import UserWidget from '../widgets/UserWidgets';
import FriendListWidget from '../widgets/FriendListWidget';
import Friend from '../../components/Friend';
import { useParams } from 'react-router-dom';

const SearchPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const users = useSelector((state) => state.users);
    const {_id, picturePath} = useSelector((state) => state.user);
    let {val} = useParams();
    console.log(val);
    const [resultData,setResultData] = useState([])

    useEffect(() => {
        setResultData(users.filter((user) => {const name=user.firstName+" "+user.lastName; return name.toLowerCase().includes(val.toLowerCase())}));
    },[val])

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
                {isNonMobileScreens && <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget userId={_id} picturePath={picturePath} />
                </Box>}
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                   {resultData.map((user) => (
                    <Friend
                        key={user._id}
                        friendId={user._id}
                        name={`${user.firstName} ${user.lastName}`}
                        subtitle={user.occupation}
                        userPicturePath={user.picturePath}
                    />
                ))} 
                </Box>
                {isNonMobileScreens && <Box flexBasis="26%">
                    <FriendListWidget userId={_id} />
                </Box>}
            </Box>
        </Box>
    );
};

export default SearchPage