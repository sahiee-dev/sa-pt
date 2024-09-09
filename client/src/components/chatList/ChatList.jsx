import React from 'react'
import './chatList.css'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const ChatList = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ['userChats'],  // Changed from 'repoData' to 'userChats' for clarity
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
                credentials: "include"
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            }),
    })

    return (
        <div className='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a new chat</Link>
            <Link to="/">Explore</Link>
            <Link to="/">Contact</Link>
            <hr />
            <span className='title'>RECENT CHATS</span>
            <div className="list">
                {isPending ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error.message}</p>
                ) : (
                    data && data.length > 0 ? (
                        data.map(chat => (
                            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                                {chat.title || 'Untitled Chat'}
                            </Link>
                        ))
                    ) : (
                        <p>No recent chats</p>
                    )
                )}
            </div>
            <hr />
            <div className="upgrade">
                <img src="/logo.png" alt="Logo" />  {/* Changed to absolute path */}
                <div className="texts">
                    <span>Upgrade to sa-pt pro</span>
                    <span>Get unlimited access to all the features</span>
                </div>
            </div>
        </div>
    )
}

export default ChatList
