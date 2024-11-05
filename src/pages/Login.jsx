import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { auth } from '../config/firebase'; // Adjust path as necessary
import '../styles.css';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        console.log("Email:", email); // Log email
        console.log("Password length:", password.length); // Log password length

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('User signed up:', user);
                navigate('/home'); // Redirect after signup
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('User logged in:', userCredential.user);
                navigate('/home'); // Redirect to quiz creation page
            }
        } catch (error) {
            console.error("Authentication error:", error.code, error.message);
            // Handle errors as previously discussed
        }
    };

    return (
        <div className='flex flex-col justify-between items-center w-screen h-screen font-inter bg-white'>
            <img src={logo} className='w-[300px] h-[300px]' />

            <form onSubmit={handleAuth}
                className='flex flex-col justify-start w-screen h-1/2 gap-4 p-12 bg-zinc-900 rounded-t-3xl text-white'
            >
                <h2 className='text-3xl md:text-4xl font-semibold mb-6'>
                    Quiz Your Way to Knowledge👋
                </h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    className='p-1 rounded-md text-black'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    className='p-1 rounded-md text-black'
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className='p-1 rounded-md text-white bg-yellow-400'>{isSignUp ? 'Sign Up' : 'Login'}</button>
                <p className='text-xs text-center'>If you can't login it means your password or email is wrong? retry...</p>
                <button onClick={() => setIsSignUp(!isSignUp)} className='text-sm underline text-yellow-400'>
                    Switch to {isSignUp ? 'Login' : 'Sign Up'}
                </button>
            </form>

        </div>
    );
};

export default Login;
