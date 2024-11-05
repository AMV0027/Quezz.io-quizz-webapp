// src/pages/Scoreboard.jsx
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { db } from '../config/firebase';

const Scoreboard = ({ quizId, onClose }) => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const fetchScores = async () => {
            const scoresRef = collection(db, 'quizzes', quizId, 'submissions');
            const q = query(scoresRef);
            const querySnapshot = await getDocs(q);
            const scoreList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setScores(scoreList);
        };

        fetchScores();
    }, [quizId]);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center font-inter">
            <div className="bg-white p-5 w-[95vw] md:w-[60vw] h-[80vh] rounded-xl flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-semibold underline mb-2">Scoreboard for Quiz ID: {quizId}</h2>
                    <ul className='overflow-x-auto'>
                        {scores.length !== 0 ?
                            (
                                <li className="flex justify-between under border-b-[2px] p-1">
                                    <span className='flex gap-2 items-center'><FaUser className='text-yellow-400' /> User name</span>
                                    <span>Scores</span>
                                </li>
                            ) : (
                                <></>
                            )
                        }

                        {scores.length > 0 ? scores.map((score) => (
                            <li key={score.id} className="flex justify-between under border-b-[2px] p-1">
                                <span> {score.userName}</span>
                                <span className='pr-6'>{score.score}</span>
                            </li>
                        )) : (
                            <p>No scores available yet.</p>
                        )}
                    </ul>
                </div>
                <button onClick={onClose} className="mt-4 bg-red-500 text-white p-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Scoreboard;
