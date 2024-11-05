import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa6";
import { MdSportsScore } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../config/AuthContext'; // Assuming you have an AuthContext
import { db } from '../config/firebase';
import Scoreboard from './Scoreboard';

const Home = () => {
    const { user } = useAuth(); // Get current user from AuthContext
    const [quizzes, setQuizzes] = useState([]);
    const [scoreboardData, setScoreboardData] = useState(null);
    const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (user) {
                const quizCollection = collection(db, 'quizzes');
                const userQuizzesQuery = query(quizCollection, where('createdBy', '==', user.uid)); // Filter by current user ID
                const quizSnapshot = await getDocs(userQuizzesQuery);
                const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuizzes(quizList);
            }
        };

        fetchQuizzes();
    }, [user]);

    const handleScoreboardClick = async (quizId) => {
        setSelectedQuizId(quizId);
        setIsScoreboardOpen(true);
        // Fetch scoreboard data based on the quizId
    };

    const closeScoreboard = () => {
        setIsScoreboardOpen(false);
    };

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
            <div className='w-screen flex flex-row justify-around'>
                <button onClick={() => navigate('/create-quiz')}
                    className='flex flex-col items-center bg-yellow-400 text-white p-4 rounded-xl w-[150px] h-[80px] font-semibold'
                >
                    <FaNotesMedical className='text-2xl' />
                    Create Quiz
                </button>
                <button onClick={() => navigate('/join-quiz')}
                    className='flex flex-col items-center bg-yellow-400 text-white p-4 rounded-xl w-[150px] h-[80px] font-semibold'
                >
                    <SiGoogleclassroom className='text-2xl' />
                    Join Quiz
                </button>
            </div>
            <h2 className='text-xl font-semibold mt-6'>Your Created Quizzes</h2>
            <ul className='border-2 w-[95vw] p-2 flex flex-col gap-2'>
                {quizzes.length == 0 ?
                    (<p className='text-sm text-center text-yellow-500'>No quizzes found. Create some quizzes to see them here.</p>)
                    :
                    quizzes.map((quiz) => (
                        <li key={quiz.id} className="flex justify-between items-center bg-zinc-200 rounded p-1 pl-4">
                            <span>{quiz.quizName} -  [ ID: {quiz.id} ]</span>
                            <button
                                onClick={() => handleScoreboardClick(quiz.id)}
                                className="ml-4 bg-yellow-400 text-white p-2 rounded flex flex-row items-center gap-2"
                            >
                                Scoreboard <MdSportsScore className='text-2xl' />
                            </button>
                        </li>
                    ))}
            </ul>

            {/* Scoreboard Popup */}
            {isScoreboardOpen && (
                <Scoreboard quizId={selectedQuizId} onClose={closeScoreboard} />
            )}
        </div>
    );
};

export default Home;
