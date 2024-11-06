import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaEye, FaHome, FaInfoCircle } from "react-icons/fa";
import { FaDeleteLeft, FaNotesMedical } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../config/AuthContext';
import { db } from '../config/firebase';
import Scoreboard from './Scoreboard';

const Home = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [scoreboardData, setScoreboardData] = useState(null);
    const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (user) {
                const quizCollection = collection(db, 'quizzes');
                const userQuizzesQuery = query(quizCollection, where('createdBy', '==', user.uid));
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
    };

    const closeScoreboard = () => {
        setIsScoreboardOpen(false);
    };

    const handleDeleteQuiz = async (quizId) => {
        const quizDocRef = doc(db, 'quizzes', quizId);
        try {
            await deleteDoc(quizDocRef);
            setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
            alert("Quiz deleted successfully.");
        } catch (error) {
            console.error("Error deleting quiz: ", error);
            alert("Failed to delete quiz. Please try again.");
        }
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
            <div className='w-[95vw] p-2 text-sm md:text-md'>
                {quizzes.length === 0 ? (
                    <p className='text-sm text-center text-yellow-500'>
                        No quizzes found. Create some quizzes to see them here.
                    </p>
                ) : (
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-yellow-400 text-white'>
                                <th className='p-2 border'>Quiz Name</th>
                                <th className='p-2 border'>Quiz ID</th>
                                <th className='p-2 border'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map((quiz) => (
                                <tr key={quiz.id} className='bg-zinc-200'>
                                    <td className='p-2 border text-left'>{quiz.quizName}</td>
                                    <td className='p-2 border text-center bg-yellow-100'>{quiz.id}</td>
                                    <td className='p-2 border text-center flex flex-row justify-center items-center'>
                                        <button
                                            onClick={() => handleScoreboardClick(quiz.id)}
                                            className="bg-yellow-400 text-white p-2 rounded flex flex-row items-center gap-2 mr-2"
                                        >
                                            Score <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuiz(quiz.id)}
                                            className="bg-red-500 text-white p-2 rounded"
                                        >
                                            <FaDeleteLeft />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Scoreboard Popup */}
            {isScoreboardOpen && (
                <Scoreboard quizId={selectedQuizId} onClose={closeScoreboard} />
            )}
        </div>
    );
};

export default Home;
