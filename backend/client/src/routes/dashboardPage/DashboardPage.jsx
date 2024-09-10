import React from 'react'
import './dashboardPage.css'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const DashboardPage = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { getToken } = useAuth()

    const mutation = useMutation({
        mutationFn: async (text) => {
            const token = await getToken()
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['userChats'] });
            navigate(`/dashboard/chats/${data._id}`);
        },
        onError: (error) => {
            console.error('Error creating chat:', error);
            // You might want to show an error message to the user here
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value.trim();
        if (!text) return;

        mutation.mutate(text);
        e.target.reset(); // Clear the input after submission
    };

    return (
        <div className='dashboardPage'>
            <div className="texts">
                <div className="logo">
                    <img src="/logo.png" alt="Logo" />
                    <h1>SA-PT</h1>
                </div>
                <div className="options">
                    <div className="option">
                        <img src="/chat.png" alt="Chat icon" />
                        <span>Create a new chat</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="Image icon" />
                        <span>Analyze Images</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt="Code icon" />
                        <span>Help me with my code</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <input type="text" name='text' placeholder='ask me anything' />
                    <button type="submit" disabled={mutation.isPending}>
                        <img src="/arrow.png" alt="Submit arrow" />
                    </button>
                </form>
                {mutation.isPending && <p>Creating chat...</p>}
                {mutation.isError && <p>Error: {mutation.error.message}</p>}
            </div>
        </div>
    )
}

export default DashboardPage;
