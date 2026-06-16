import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle,
  Send,
  Loader2,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Clock,
  Play,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizAttempt({ quiz, submission, onSubmit, onCancel, user, onGradeSubmission, onChangeSubmission }) {
  const timeLimit = quiz.questions.length * 120; // 2 minutes per question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [quizStarted, setQuizStarted] = useState(user?.role !== 'student');
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Teacher grading states
  const [teacherGrade, setTeacherGrade] = useState(submission?.score !== undefined ? submission.score : '');
  const [teacherFeedback, setTeacherFeedback] = useState(submission?.feedback || '');
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  // Sync grading input states when submission changes
  useEffect(() => {
    if (submission) {
      setTeacherGrade(submission.score !== undefined ? submission.score : '');
      setTeacherFeedback(submission.feedback || '');
    }
  }, [submission]);

  const handleSaveGradeAndFeedback = async (e) => {
    e.preventDefault();
    setIsSavingGrade(true);
    try {
      await onGradeSubmission(submission._id, parseFloat(teacherGrade), teacherFeedback);
      alert('Grade and comment saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save grade');
    } finally {
      setIsSavingGrade(false);
    }
  };

  // Timer loop
  useEffect(() => {
    if (!quizStarted || result || submission) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, result, submission]);

  const handleSelect = (optionIndex) => {
    if (user?.role === 'student') {
      setAnswers({ ...answers, [currentQuestion]: optionIndex });
    }
  };

  const handleAutoSubmit = async () => {
    setIsSubmitting(true);
    const formattedAnswers = quiz.questions.map((_, idx) => ({
      questionIndex: idx,
      selectedOption: answers[idx] !== undefined ? answers[idx] : -1
    }));
    const res = await onSubmit(formattedAnswers);
    setResult(res);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formattedAnswers = Object.keys(answers).map(key => ({
      questionIndex: parseInt(key),
      selectedOption: answers[key]
    }));
    
    // Add any unanswered questions
    quiz.questions.forEach((_, idx) => {
      if (answers[idx] === undefined) {
        formattedAnswers.push({
          questionIndex: idx,
          selectedOption: -1
        });
      }
    });

    const res = await onSubmit(formattedAnswers);
    setResult(res);
    setIsSubmitting(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeResult = result || submission;

  if (activeResult) {
    const totalScore = activeResult.score;
    const feedback = activeResult.feedback;
    const answersReview = activeResult.answers || [];

    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        {/* Teacher review header with navigation */}
        {user?.role === 'teacher' && submission && (
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black">
                {submission.studentId?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Reviewing Attempt</span>
                <span className="font-black text-slate-800">{submission.studentId?.username}</span>
              </div>
            </div>
            
            {onChangeSubmission && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onChangeSubmission('prev')}
                  className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
                  title="Previous Student"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onChangeSubmission('next')}
                  className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
                  title="Next Student"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl text-center space-y-8"
        >
          <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
             <Trophy className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quiz Scorecard</h2>
            <p className="text-slate-500 font-medium mt-1">Review your performance details below.</p>
          </div>
          <div className="bg-slate-950 p-8 rounded-[2rem] relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent opacity-50" />
             <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 relative z-10">Total Score</p>
             <h3 className="text-5xl font-black text-white relative z-10">
               {totalScore} <span className="text-xl text-slate-500">/ {quiz.totalPoints} Pts</span>
             </h3>
          </div>

          {feedback && (
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-left space-y-2">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">Instructor Feedback</span>
              <p className="text-sm font-bold text-amber-900 whitespace-pre-wrap">{feedback}</p>
            </div>
          )}

          <div className="text-left space-y-6">
            <h4 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3">Answer Review</h4>
            <div className="space-y-6">
              {quiz.questions.map((q, idx) => {
                const reviewItem = answersReview.find(ans => ans.questionIndex === idx);
                const selected = reviewItem?.selectedOption;
                const isCorrect = reviewItem?.isCorrect;

                return (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h5 className="font-bold text-slate-800 leading-snug flex-1">
                        <span className="font-black text-slate-400 mr-2">Q{idx + 1}.</span> {q.question}
                      </h5>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 border",
                        isCorrect 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : selected === -1 
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                      )}>
                        {isCorrect ? 'Correct' : selected === -1 ? 'Not Answered' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selected === oIdx;
                        const isCorrectOption = q.correctAnswer === oIdx;

                        return (
                          <div 
                            key={oIdx}
                            className={cn(
                              "p-4 rounded-xl border font-bold text-sm flex items-center gap-3 transition-colors",
                              isCorrectOption 
                                ? "bg-emerald-50 border-emerald-500 text-emerald-900" 
                                : isSelected 
                                  ? "bg-rose-50 border-rose-500 text-rose-900"
                                  : "bg-white border-slate-100 text-slate-500"
                            )}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded flex items-center justify-center text-[10px] font-black uppercase tracking-widest shrink-0",
                              isCorrectOption 
                                ? "bg-emerald-600 text-white" 
                                : isSelected 
                                  ? "bg-rose-600 text-white"
                                  : "bg-slate-50 text-slate-400 border border-slate-100"
                            )}>
                              {String.fromCharCode(65 + oIdx)}
                            </div>
                            <span className="flex-1">{opt}</span>
                            {isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {!isCorrectOption && isSelected && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400">Points: {isCorrect ? q.points || 5 : 0} / {q.points || 5}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher Grading and Comments Console */}
          {user?.role === 'teacher' && submission && (
            <form onSubmit={handleSaveGradeAndFeedback} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-left space-y-6">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs border-b border-slate-200/50 pb-2">Grading Console</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Grade Override / {quiz.totalPoints}</label>
                  <input 
                    type="number" required
                    value={teacherGrade}
                    onChange={(e) => setTeacherGrade(e.target.value)}
                    max={quiz.totalPoints}
                    className="w-full px-5 py-3.5 rounded-xl bg-white border border-slate-200 focus:border-teal-500 transition-all outline-none font-bold text-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Comment / Feedback</label>
                  <textarea 
                    value={teacherFeedback}
                    onChange={(e) => setTeacherFeedback(e.target.value)}
                    placeholder="Leave a comment or feedback for this student..."
                    className="w-full px-5 py-3.5 rounded-xl bg-white border border-slate-200 focus:border-teal-500 transition-all outline-none font-bold resize-none h-20"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isSavingGrade}
                className="w-full py-4 bg-teal-600 text-white rounded-xl font-black text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSavingGrade ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Grade & Comment'}
              </button>
            </form>
          )}

          <button 
            onClick={onCancel}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
          >
            Return to Classroom
          </button>
        </motion.div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-10 max-w-2xl mx-auto border border-slate-100 shadow-2xl text-center space-y-8"
      >
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{quiz.title}</h2>
          <p className="text-slate-500 font-bold mt-2">{quiz.instructions || 'Please read instructions carefully before starting.'}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Questions</span>
            <span className="text-lg font-black text-slate-800">{quiz.questions?.length} Qs</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Duration</span>
            <span className="text-lg font-black text-slate-800">{Math.round(timeLimit / 60)} Mins</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Points</span>
            <span className="text-lg font-black text-slate-800">{quiz.totalPoints} Pts</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button" onClick={onCancel}
            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button 
            type="button" onClick={() => setQuizStarted(true)}
            className="flex-1.5 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current animate-pulse" /> Start Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  const q = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const timeProgress = (timeLeft / timeLimit) * 100;
  const isTimeLow = timeLeft < 60;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{quiz.title}</h2>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Question {currentQuestion + 1} of {quiz.questions.length}</span>
          </div>
          {user?.role === 'student' && (
            <div className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-2xl font-black border transition-all",
              isTimeLow 
                ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" 
                : "bg-slate-50 border-slate-100 text-slate-700"
            )}>
              <Clock className="w-5 h-5 shrink-0" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Progress bars */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span>Quiz Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              className="h-full bg-teal-600 rounded-full"
            />
          </div>
        </div>

        {/* Question Grid Map */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
          {quiz.questions.map((_, idx) => {
            const isAnswered = answers[idx] !== undefined;
            const isCurrent = idx === currentQuestion;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={cn(
                  "w-10 h-10 rounded-xl font-black text-xs transition-all border-2 flex items-center justify-center",
                  isCurrent 
                    ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-100"
                    : isAnswered
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative"
        >
          <div className="absolute top-8 right-8 bg-teal-50 text-teal-600 border border-teal-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            +{q.points || 5} Pts
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-10 leading-tight pr-16">{q.question}</h3>
          
          <div className="space-y-4">
            {q.options.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group",
                  user?.role !== 'student' && "cursor-default",
                  answers[currentQuestion] === idx 
                    ? "border-teal-600 bg-teal-50/50 shadow-lg shadow-teal-100/50" 
                    : "border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-white"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-colors",
                  answers[currentQuestion] === idx ? "bg-teal-600 text-white" : "bg-white text-slate-400 border border-slate-100"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={cn(
                  "font-bold transition-colors",
                  answers[currentQuestion] === idx ? "text-teal-900" : "text-slate-600"
                )}>{opt}</span>
                {answers[currentQuestion] === idx && <CheckCircle2 className="ml-auto w-5 h-5 text-teal-600" />}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center px-4">
        <button 
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          className="p-4 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-all disabled:opacity-30 shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {user?.role !== 'student' ? (
          <div className="flex gap-4">
            {currentQuestion < quiz.questions.length - 1 ? (
              <button 
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className="bg-teal-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center gap-3"
              >
                Next Question <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={onCancel}
                className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3"
              >
                Close Preview
              </button>
            )}
          </div>
        ) : currentQuestion === quiz.questions.length - 1 ? (
          <button 
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Assessment</>}
          </button>
        ) : (
          <button 
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className="bg-teal-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center gap-3"
          >
            Next Question <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
