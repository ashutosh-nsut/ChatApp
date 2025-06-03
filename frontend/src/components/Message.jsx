import React, { useEffect, useRef } from 'react';
import { useSelector } from "react-redux";

const Message = ({ message }) => {
    //useRef is so that i get the scroll directly to recent send messgae and need to scroll down again and again
    const scroll = useRef();
    const { authUser, selectedUser } = useSelector(store => store.user);

    // If message doesn't have a timestamp, add one using Date.now()
    const messageTimestamp = message?.timestamp || Date.now();

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return ''; // Return empty if invalid date
        }
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        //chat start ->first chat then space, chat end->first space then chat
        <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={message?.senderId === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto} />
                </div>
            </div> 
            <div className="chat-header">
                <time className="text-xs opacity-50 text-white">{formatTime(messageTimestamp)}</time>
            </div>
            <div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : ''}`}>
                {message?.message}
            </div>
        </div>
    );
};

export default Message;
