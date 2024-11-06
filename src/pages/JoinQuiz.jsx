import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../config/AuthContext';
import { db } from '../config/firebase';

const JoinQuiz = () => {
    const { user } = useAuth();
    const [quizCode, setQuizCode] = useState('');
    const [userName, setUserName] = useState(''); // State for user name
    const [quiz, setQuiz] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate(true);

    const handleJoin = async (e) => {
        e.preventDefault();
        const quizDoc = await getDoc(doc(db, 'quizzes', quizCode));
        if (quizDoc.exists()) {
            setQuiz(quizDoc.data());
            setUserAnswers({}); // Reset user answers
            setSubmitted(false); // Reset submitted state
        } else {
            alert('Quiz not found');
        }
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: answer,
        }));
    };

    const handleSubmit = async () => {
        // Check if the user has already submitted answers for this quiz
        const quizRef = collection(db, 'quizzes', quizCode, 'submissions');
        const q = query(quizRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert('You have already submitted answers for this quiz.');
            return;
        }

        // Calculate the score
        let correctAnswers = 0;
        quiz.questions.forEach((q, index) => {
            if (userAnswers[index] === q.answer) {
                correctAnswers++;
            }
        });

        // Save the score along with the user's name
        await addDoc(quizRef, {
            userId: user.uid,
            userName: userName || user.displayName, // Use entered name or fallback to displayName
            score: correctAnswers,
        });

        setScore(correctAnswers);
        setSubmitted(true);
    };

    return (
        <div className='bg-white min-h-screen overflow-y- w-screen flex flex-col justify-start items-center font-inter'>
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
            <h1 className='text-2xl font-semibold mb-4'>Join Quiz</h1>
            <form onSubmit={handleJoin} className='flex flex-col justify-center gap-4 items-center w-[65vw] md:w-[40vw]'>
                <input
                    type="text"
                    placeholder="Enter Quiz Code"
                    className='p-1 rounded-md w-full text-black border-yellow-400 border-[2px]'
                    onChange={(e) => setQuizCode(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Enter Your Name"
                    className='p-1 rounded-md w-full text-black border-yellow-400 border-[2px]'
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <button type="submit" className='p-1 rounded-md bg-yellow-400 w-full text-white'>Join</button>
            </form>
            {quiz && (
                <div className='border-t-2 border-yellow-400 w-screen p-5 mt-5'>
                    <h2 className='text-xl font-semibold underline mb-5'>Attend {quiz.quizName}</h2>
                    {quiz.questions.map((q, index) => (
                        <div key={index} className='p-4 mb-2 bg-yellow-100 rounded-xl'>
                            <p className='font-semibold mb-2'>{q.question}</p>
                            {q.options.map((opt, optionIndex) => (
                                <div key={optionIndex}>
                                    <input
                                        type="radio"
                                        name={`question${index}`}
                                        value={opt}
                                        className=" mr-2"
                                        onChange={() => handleAnswerChange(index, opt)}
                                    />
                                    {opt}
                                </div>
                            ))}
                        </div>
                    ))}
                    <button onClick={handleSubmit} className='mt-2 bg-green-700 text-white p-2 w-full rounded-xl mb-5'>Submit Answers</button>
                </div>
            )}
            {submitted &&
                alert("Your score : ", score)
                    (
                        <div className='mb-5 flex flex-row justify-center'>
                            <h4>Your Score 🏆 : {score}</h4>
                        </div>
                    )}
        </div>
    );
};

export default JoinQuiz;
