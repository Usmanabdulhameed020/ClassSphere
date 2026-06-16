import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuizBuilder({ onSave, onCancel }) {
  const [quiz, setQuiz] = useState({
    title: '',
    instructions: '',
    questions: [
      { question: '', options: ['', '', '', ''], correctAnswer: null, points: 5 }
    ]
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { question: '', options: ['', '', '', ''], correctAnswer: null, points: 5 }]
    });
  };

  const removeQuestion = (index) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index)
    });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const unansweredIndex = quiz.questions.findIndex(
      q => q.correctAnswer === null || q.correctAnswer === undefined || q.correctAnswer < 0
    );

    if (unansweredIndex !== -1) {
      setError(`Please select a correct answer for Question ${unansweredIndex + 1}.`);
      return;
    }

    setIsSaving(true);
    const totalPoints = quiz.questions.reduce((acc, q) => acc + parseInt(q.points), 0);
    await onSave({ ...quiz, totalPoints });
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 max-w-4xl mx-auto border border-slate-100 shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quiz Architect</h2>
          <p className="text-slate-500 font-medium mt-1">Design an interactive assessment</p>
        </div>
        <button onClick={onCancel} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-6">
          <input 
            type="text" required placeholder="Quiz Title"
            value={quiz.title} onChange={(e) => setQuiz({...quiz, title: e.target.value})}
            className="w-full text-4xl font-black border-none outline-none placeholder:text-slate-200 text-slate-900 bg-transparent"
          />
          <textarea 
            placeholder="Instructions for students..."
            value={quiz.instructions} onChange={(e) => setQuiz({...quiz, instructions: e.target.value})}
            className="w-full bg-slate-50 rounded-3xl p-6 font-bold outline-none border-2 border-transparent focus:border-teal-500 transition-all min-h-[100px]"
          />
        </div>

        <div className="space-y-8">
          {quiz.questions.map((q, qIdx) => (
            <motion.div 
              key={qIdx}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 relative group"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="bg-white px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                  Question {qIdx + 1}
                </span>
                {quiz.questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIdx)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <input 
                type="text" required placeholder="Enter your question here..."
                value={q.question} onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                className="w-full bg-white rounded-2xl p-6 font-black text-xl outline-none border-2 border-transparent focus:border-teal-500 transition-all mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100">
                    <button 
                      type="button"
                      onClick={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        q.correctAnswer === oIdx ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-300'
                      }`}
                    >
                      {q.correctAnswer === oIdx ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-black">{String.fromCharCode(65 + oIdx)}</span>}
                    </button>
                    <input 
                      type="text" required placeholder={`Option ${oIdx + 1}`}
                      value={opt} onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                      className="flex-1 outline-none font-bold text-slate-700 px-2"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points Value</label>
                <input 
                  type="number" 
                  value={q.points}
                  onChange={(e) => updateQuestion(qIdx, 'points', e.target.value)}
                  className="w-20 bg-white border border-slate-100 rounded-xl px-3 py-1 font-black text-teal-600 outline-none"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-4 pt-10">
          <button 
            type="button" onClick={addQuestion}
            className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-3xl font-black text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Question
          </button>
          <button 
            type="submit" disabled={isSaving}
            className="flex-1 py-5 bg-teal-600 text-white rounded-3xl font-black text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Launch Quiz</>}
          </button>
        </div>
      </form>
    </div>
  );
}
