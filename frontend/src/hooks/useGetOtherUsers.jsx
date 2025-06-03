import React, { useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '..';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();
    //Network call
    //this useEffect will always be rendered once when home page is loaded
    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;//cors policy
                const res = await axios.get(`${BASE_URL}/api/v1/user`);
                // store
                console.log("other users -> ",res);
                //res.data will go in action.payload
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.log(error);
            }
        }
        //we call the function here only
        fetchOtherUsers();
    }, [])

}

export default useGetOtherUsers