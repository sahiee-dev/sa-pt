import React, { useEffect, useState } from 'react'
import './dashboardLayout.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import ChatList from '../../components/chatList/ChatList'

const DashboardLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { userId, isLoaded } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/sign-in")
        }
    }, [isLoaded, userId, navigate])

    if (!isLoaded) return "Loading...";

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <div className='dashboardLayout'>
            <button className="menuToggle" onClick={toggleMenu}>
                {isMenuOpen ? 'Close' : 'Open'} Menu
            </button>
            <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
                <ChatList />
            </div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout
