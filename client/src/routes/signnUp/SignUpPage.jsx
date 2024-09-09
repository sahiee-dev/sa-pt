import React from 'react'
import './signUp.css'
import { SignUp } from '@clerk/clerk-react'

const SignUpPage = () => {
    return (
        <div className='signUp'>
            <SignUp path="/sign-up" signInUrl='/sign-in' />
        </div>
    )
}

export default SignUpPage
