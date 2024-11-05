// src/components/Info.jsx
import React from 'react';
import { FaGithubSquare, FaHome, FaInfoCircle, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Info = () => {
    const navigate = useNavigate();
    return (
        <div className='bg-white min-h-screen w-screen flex flex-col justify-start items-center font-inter'>
            <nav className='flex flex-col items-center h-3/6 bg-black w-full rounded-b-3xl mb-12'>
                <div className='flex flex-row justify-between w-full pl-5 pr-5 pt-3'>
                    <button className='text-white text-xl' onClick={() => navigate('/home')}>
                        <FaHome />
                    </button>
                    <button className='text-white text-xl' onClick={() => navigate('/info')}>
                        <FaInfoCircle />
                    </button>
                </div>
                <img src={logo} className='w-[200px] h-[120px] object-cover invert' />
            </nav>
            <div className='p-5'>

                <h1 className="text-2xl font-semibold mb-4">About This Project</h1>
                <p className="mb-4">
                    This project was developed as part of my Internet Programming Laboratory work for college. It showcases various web development technologies and best practices, demonstrating my proficiency in building functional, interactive web applications.
                </p>
                <h2 className="text-xl font-semibold mt-6 mb-2">About Me</h2>
                <p className="mb-4">
                    I'm a passionate developer who loves exploring different facets of web development and programming. From front-end to back-end, I enjoy building things that make a positive impact and continuously enhance my skills by working on various projects.
                </p>
                <h2 className="text-lg font-semibold mt-6 mb-2">Connect with Me</h2>
                <div className="flex space-x-4 mt-4 text-3xl">
                    <a href="https://www.linkedin.com/in/arunmozhi-varman-2565b3266/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <FaLinkedin />
                    </a>
                    <a href="https://github.com/AMV0027" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-900">
                        <FaGithubSquare />
                    </a>
                    <a href="https://leetcode.com/u/AMV0027/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-green-800">
                        <SiLeetcode />
                    </a>
                </div>
            </div>
        </div >
    );
};

export default Info;
