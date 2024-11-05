import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from '../assets/logo.png';
import { useAuth } from '../config/AuthContext';
import { db } from '../config/firebase';

const CreateQuiz = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); // Initialize navigate
    const [quizName, setQuizName] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
    const [quizCount, setQuizCount] = useState(0);

    const addQuestion = () => {
        if (questions.length < 4) {
            setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
        } else {
            alert('Maximum 4 questions allowed');
        }
    };

    const removeQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const generateQuizId = () => {
        return Math.floor(10000 + Math.random() * 90000).toString(); // Generate a 5-digit random ID
    };

    const handleCreateQuiz = async () => {
        if (quizCount >= 3) {
            alert('You have reached the quiz creation limit of 3 quizzes.');
            return;
        }

        // Validate that each question has a question text, four options, and one correct answer
        for (const q of questions) {
            if (!q.question || !q.options.every(opt => opt) || !q.answer) {
                alert('Please fill in all fields for each question.');
                return;
            }
            if (!q.options.includes(q.answer)) {
                alert('The correct answer must be one of the provided options.');
                return;
            }
        }

        // Store the quiz in Firestore with a unique 5-digit quiz ID
        const quizId = generateQuizId();
        await setDoc(doc(db, 'quizzes', quizId), { quizName, questions, createdBy: user.uid });

        // Increment quiz count and navigate to the home page
        setQuizCount(quizCount + 1);
        alert('Quiz created successfully! Your quiz ID is: ' + quizId);
        navigate('/home'); // Redirect to home page
    };

    const handleOptionChange = (index, value, optionIndex) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[index].options[optionIndex] = value;
            return updatedQuestions;
        });
    };

    const handleAnswerChange = (index, answer) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answer = answer;
        setQuestions(updatedQuestions);
    };

    return (
        <div>
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
            <h1 className='text-xl font-semibold mb-4 text-center'>Create a New Quiz</h1>
            <div className='p-5'>
                <p>Your Quiz name : </p>
                <input
                    type="text"
                    placeholder="Quiz Name"
                    onChange={(e) => setQuizName(e.target.value)}
                    value={quizName}
                    className='p-1 rounded-md w-full text-black border-yellow-400 border-[2px]'
                    required
                />
                <p className='mt-2 text-xs'>You can add a maximum of {4 - questions.length} more question(s).</p>
                {questions.map((q, index) => (
                    <div key={index} className='bg-yellow-100 rounded-xl p-5'>
                        <textarea
                            type="text"
                            placeholder="Question"
                            value={q.question}
                            onChange={(e) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].question = e.target.value;
                                setQuestions(updatedQuestions);
                            }}
                            className='p-1 mb-5 h-[100px] rounded-md w-full text-black border-yellow-400 border-[2px]'
                            required
                        />
                        {q.options.map((opt, optionIndex) => (
                            <div key={optionIndex} className='flex flex-row gap-4 justify-start'>
                                <input
                                    type="text"
                                    placeholder={`Option ${optionIndex + 1}`}
                                    value={opt}
                                    className='p-1 rounded-md w-2/3 text-black border-yellow-400 border-[2px] mb-3'
                                    onChange={(e) => handleOptionChange(index, e.target.value, optionIndex)}
                                    required
                                />
                                <label>
                                    <input
                                        type="radio"
                                        name={`answer${index}`}
                                        value={opt}
                                        checked={q.answer === opt}
                                        className='mr-2'
                                        onChange={() => handleAnswerChange(index, opt)}
                                    />
                                    ✅
                                </label>
                            </div>
                        ))}
                        <button onClick={() => removeQuestion(index)} className='p-2 rounded text-red-400 bg-white border-2'>Remove</button> {/* Button to remove question */}
                    </div>
                ))}
                <button onClick={addQuestion} className='bg-green-600 text-white p-2 w-full rounded-xl mt-5'>Add Question</button>
                <button onClick={handleCreateQuiz} className='mt-2 bg-yellow-400 text-white p-2 w-full rounded-xl mb-5'>Create Quiz</button>
            </div>
        </div>
    );
};

export default CreateQuiz;
