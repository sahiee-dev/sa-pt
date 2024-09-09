import React from 'react'
import './homepage.css'
import { Link } from 'react-router-dom'

const Homepage = () => {
    const numLines = 12; // Number of lines
    const lines = [];

    for (let i = 0; i < numLines; i++) {
        lines.push(<div key={i} className="line" style={{ transform: `rotate(${i * (360 / numLines)}deg)` }} />);
    }



    return (
        <>
            <header>
                <nav>
                    <p>Revolutionize your chats</p>
                    <ul>
                        <li><a href='#home'>Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#chat">Chat</a></li>
                    </ul>
                </nav>
            </header>
            <section className='one' id='home'>
                <div className='heading'><h1>sa-pt</h1></div>
                <button id='dashboard'><Link className='click' to='/dashboard'>Chat now</Link></button>
                <div className="vector"></div>
                <div className="vector2"></div>
                <div className="vector3"></div>
            </section>
            <section className='two'>
                <div className="whole">
                    <div className="container-1">
                        <div className="left">
                            <hr />
                            <p>Ever wished your chats could be as lively, witty, and compelling as those seen in your favorite movies? Buckle up, because ChatGPT is here and it's transforming the chat-landscape!</p>
                        </div>
                        <div className="right">
                            <img src="/src/assets/sect-2-img.jpg" alt="Section 2 Image 1" />
                        </div>
                    </div>

                    <div className="container-2">
                        <div className="left">
                            <img src="/src/assets/sect-2-img2.jpg" alt="Section 2 Image 2" />
                        </div>
                        <div className="right">
                            <hr />
                            <p>AI that generates text based on prompts.</p>
                        </div>
                    </div>

                </div>
            </section>
            <div className="vector-background">
                {lines}
            </div>

            <div className="vector-section-two"></div>
            <section className='three' id='features'>
                <div className="about1">
                    <div className="vector"></div>
                    <div className="left">
                        <img src="/src/assets/gemini.png" alt="Gemini AI" />
                    </div>
                    <div className="right">
                        <h1>Gemini AI</h1>
                        <p>We leverage the power of the Gemini AI API under the hood to enhance our platform's capabilities. By integrating this advanced AI technology, we ensure seamless performance, intelligent automation, and highly accurate results, all while maintaining a user-friendly experience.</p>
                    </div>
                </div>
                <div className="vector-section-four"></div>
                <div className="vector2"></div>
                <div className="vector3"></div>
                <div className="about2">
                    <div className="left">
                        <img src="/src/assets/img1.jpg" alt="Minimalistic Interface" />
                    </div>
                    <div className="right">
                        <h1>Minimalistic yet Powerful - The Future of Communication</h1>
                        <p>Experience a dialogue interface unlike any you've encountered. Our contemporary layout is intuitive, user-friendly, and packed with features. Get ready to elevate your communication journey.</p>
                    </div>
                </div>

                <div className="about3">
                    <div className="left">
                        <h1>Enhancing User Experience with AI-Powered Chatbot</h1>
                        <p>Our platform integrates a cutting-edge AI chatbot to provide real-time, intelligent responses and streamline communication. This advanced system is designed to assist with user inquiries, automate tasks, and offer personalized support, ensuring a faster and more efficient experience.</p>
                    </div>
                    <div className="right">
                        <img src="/src/assets/img2.jpg" alt="AI-Powered Chatbot" />
                    </div>
                </div>
            </section>
            <section className='four' id='chat'>
                <h1>Join now</h1>
                <p>Why wait? You're one click away from <br /> experiencing chat like never before. <br /> Don't be last aboard the ChatGPT revolution.</p>

                <div className="vector-background">
                    {lines}
                </div>
                <div className="vector"></div>
                <div className="vector2"></div>
                <div className="vector3"></div>
                <button><Link to='/dashboard'>Chat now</Link></button>
            </section>
            <footer>
                <p>&copy; 2024 sahir</p>
            </footer>
        </>
    )
}

export default Homepage
