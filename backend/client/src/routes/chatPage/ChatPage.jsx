import React from 'react'
import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import Markdown from 'react-markdown'
import { IKImage } from 'imagekitio-react'

const ChatPage = () => {
    const location = useLocation()
    const chatId = location.pathname.split("/").pop()

    const { isLoading, error, data } = useQuery({
        queryKey: ['chat', chatId],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
                credentials: "include",
            }).then((res) => res.json()),
    });

    return (
        <div className='chatPage'>
            <div className="wrapper">
                <div className="chat">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error.message}</p>
                    ) : (
                        data?.history?.map((message, i) => (
                            <React.Fragment key={i}>
                                {message.img && (
                                    <IKImage
                                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                        path={message.img}
                                        height="300"
                                        width="400"
                                        transformation={[{ height: 300, width: 400 }]}
                                        loading="lazy"
                                        lqip={{ active: true, quality: 20 }}
                                    />
                                )}
                                <div className={`message ${message.role}`}>
                                    <Markdown>{message.parts[0].text}</Markdown>
                                </div>
                            </React.Fragment>
                        ))
                    )}
                    <NewPrompt data={data} />
                </div>
            </div>
        </div>
    )
}

export default ChatPage;
