import React, { useRef, useState, useEffect } from 'react'
import './newPrompt.css'
import model from "../../lib/gemini"
import Markdown from 'react-markdown'
import Upload from '../upload/Upload'
import { IKImage } from 'imagekitio-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'

const NewPrompt = ({ data }) => {
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
    })

    const { getToken } = useAuth()

    const chat = model.startChat({
        history: data?.history?.map(({ role, parts }) => ({
            role,
            parts: [{ text: parts[0].text }]
        })) || [],
        generationConfig: {
            // maxOutputTokens : 100,
        }
    });

    const endRef = useRef(null)
    const formRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [data, question, answer, img.dbData])

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            if (!data || !data._id) {
                throw new Error('Chat data is not available');
            }
            const token = await getToken()
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    question: question.length ? question : undefined,
                    answer,
                    img: img.dbData?.filePath || undefined,
                })
            }).then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
        },
        onSuccess: () => {
            if (data && data._id) {
                queryClient.invalidateQueries({ queryKey: ['chat', data._id] })
                    .then(() => {
                        formRef.current?.reset()
                        setQuestion("")
                        setAnswer("")
                        setImg({
                            isLoading: false,
                            error: "",
                            dbData: {},
                            aiData: {},
                        });
                    });
            }
        },
        onError: (error) => {
            console.error('Error updating chat:', error);
            // You might want to show an error message to the user here
        }
    })

    const add = async (text, isInitial) => {
        if (!isInitial) setQuestion(text)
        try {
            const result = await chat.sendMessageStream(Object.keys(img.aiData).length ? [img.aiData, text] : text);
            let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
                accumulatedText += chunkText;
                setAnswer(accumulatedText)
            }

            await mutation.mutateAsync();
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const text = e.target.text.value.trim();
        if (!text) return;

        await add(text, false);
    }

    const hasRun = useRef(false)
    useEffect(() => {
        if (!hasRun.current && data?.history?.length === 1) {
            add(data.history[0].parts[0].text, true)
            hasRun.current = true;
        }
    }, [data])

    return (
        <>
            {img.isLoading && <div className='loading'>Loading...</div>}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    width="380"
                    transformation={[{ width: 380 }]}
                />
            )}
            {question && <div className='message user'>{question}</div>}
            {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
            <div className="endChat" ref={endRef}></div>

            <form className='newForm' onSubmit={handleSubmit} ref={formRef}>
                <Upload setimg={setImg} />
                <input id="file" type="file" multiple={false} hidden />
                <input type="text" name="text" placeholder='Ask anything...' />
                <button type="submit" disabled={mutation.isPending}>
                    <img src="/arrow.png" alt="Submit" />
                </button>
            </form>
            {mutation.isPending && <p>Updating chat...</p>}
            {mutation.isError && <p>Error: {mutation.error.message}</p>}
        </>
    )
}

export default NewPrompt
