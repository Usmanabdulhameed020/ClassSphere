import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Users, 
  Send, 
  Paperclip, 
  MoreVertical, 
  ArrowLeft,
  Plus,
  FileText,
  Video,
  Layers,
  Calendar,
  X,
  Loader2,
  CheckCircle2,
  Trophy,
  ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardService } from '../services/dashboardService';
import { cn } from '../utils';
import QuizBuilder from '../components/QuizBuilder';
import QuizAttempt from '../components/QuizAttempt';
import Chat from '../components/Chat';
import { joinClassRoom, leaveClassRoom, getSocket } from '../utils/socketManager';

export default function ClassroomView({ classData, onBack, user }) {
  const [activeSubTab, setActiveSubTab] = useState('Stream');
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [people, setPeople] = useState({ teachers: [], students: [] });
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  
  // Academic State
  const [attendance, setAttendance] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [quizSubmissions, setQuizSubmissions] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [isUpdatingAttendance, setIsUpdatingAttendance] = useState(false);
  const [gradingModal, setGradingModal] = useState({ open: false, submission: null, grade: '', feedback: '', isQuiz: false });
  const [submissionModal, setSubmissionModal] = useState({ open: false, assignment: null, content: '', isReadOnly: false });

  // Quiz Specific State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [activeSubmissionForReview, setActiveSubmissionForReview] = useState(null);
  const [activeQuizSubmissions, setActiveQuizSubmissions] = useState([]);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('assignment'); // 'assignment', 'material', 'quiz'
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '' });
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeSubTab === 'Stream') {
        const data = await dashboardService.getAnnouncements(classData._id);
        setAnnouncements(data);
      } else if (activeSubTab === 'Classwork') {
        const [assigns, mats, quizList, quizSubs] = await Promise.all([
          dashboardService.getAssignments(classData._id),
          dashboardService.getMaterials(classData._id),
          dashboardService.getQuizzes(classData._id),
          dashboardService.getQuizSubmissionsForClass(classData._id)
        ]);
        setAssignments(assigns);
        setMaterials(mats);
        setQuizzes(quizList);
        setQuizSubmissions(quizSubs || []);
      } else if (activeSubTab === 'People') {
        const data = await dashboardService.getPeople(classData._id);
        setPeople(data);
      } else if (activeSubTab === 'Grades') {
        const [assignSubs, quizSubs, quizList] = await Promise.all([
          dashboardService.getSubmissions(classData._id),
          dashboardService.getQuizSubmissionsForClass(classData._id),
          dashboardService.getQuizzes(classData._id)
        ]);
        setSubmissions(assignSubs);
        setQuizSubmissions(quizSubs || []);
        setQuizzes(quizList);
      } else if (activeSubTab === 'Attendance') {
        const data = await dashboardService.getAttendance(classData._id, attendanceDate);
        setAttendance(data[0]?.records || []);
      }
    } catch (error) {
      console.error('Error fetching classroom data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [classData._id, activeSubTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Join the socket room for this class
    const socket = getSocket();
    joinClassRoom(classData._id, user);

    // Setup socket listeners for real-time classroom updates
    const handleNewAnnouncement = (ann) => {
      setAnnouncements(prev => {
        if (prev.some(a => a._id === ann._id)) return prev;
        return [ann, ...prev];
      });
    };

    const handleNewAssignment = (asgn) => {
      setAssignments(prev => {
        if (prev.some(a => a._id === asgn._id)) return prev;
        return [asgn, ...prev];
      });
    };

    const handleNewMaterial = (mat) => {
      setMaterials(prev => {
        if (prev.some(m => m._id === mat._id)) return prev;
        return [mat, ...prev];
      });
    };

    const handleNewQuiz = (qz) => {
      setQuizzes(prev => {
        if (prev.some(q => q._id === qz._id)) return prev;
        return [qz, ...prev];
      });
    };

    const handleUserJoined = () => {
      fetchData();
    };

    const handleUserLeft = () => {
      fetchData();
    };

    socket.on('announcementCreated', handleNewAnnouncement);
    socket.on('assignmentCreated', handleNewAssignment);
    socket.on('materialCreated', handleNewMaterial);
    socket.on('quizCreated', handleNewQuiz);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    return () => {
      socket.off('announcementCreated', handleNewAnnouncement);
      socket.off('assignmentCreated', handleNewAssignment);
      socket.off('materialCreated', handleNewMaterial);
      socket.off('quizCreated', handleNewQuiz);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      leaveClassRoom(classData._id, user.id || user._id);
    };
  }, [classData._id, user, fetchData]);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    setIsPosting(true);
    try {
      await dashboardService.postAnnouncement(classData._id, newAnnouncement);
      setNewAnnouncement('');
      fetchData();
    } catch (error) {
      console.error('Error posting announcement:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handlePostComment = async (announcementId) => {
    const content = commentText[announcementId];
    if (!content?.trim()) return;
    
    try {
      await dashboardService.postComment(classData._id, announcementId, content);
      setCommentText(prev => ({ ...prev, [announcementId]: '' }));
      fetchData(); // Refresh to show new comment
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleCreateContent = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      if (createType === 'assignment') {
        await dashboardService.postAssignment(classData._id, {
          title: formData.title,
          instructions: formData.description,
          points: formData.points,
          dueDate: formData.dueDate,
          topic: formData.topic
        });
      } else if (createType === 'material') {
        await dashboardService.postMaterial(classData._id, {
          title: formData.title,
          description: formData.description
        });
      } else if (createType === 'quiz') {
        setShowCreateModal(false);
        setShowQuizBuilder(true);
        setIsCreating(false);
        return;
      }
      setShowCreateModal(false);
      setFormData({ title: '', description: '', dueDate: '', points: 100, topic: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating content:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveQuiz = async (quizData) => {
    try {
      await dashboardService.createQuiz(classData._id, quizData);
      setShowQuizBuilder(false);
      fetchData();
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleSubmitQuiz = async (answers) => {
    try {
      const res = await dashboardService.submitQuiz(activeQuiz._id, answers);
      fetchData();
      return res;
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleUpdateAttendance = async (studentId, status) => {
    setIsUpdatingAttendance(true);
    try {
      const updatedRecords = attendance.map(r => 
        r.studentId._id === studentId ? { ...r, status } : r
      );
      
      // If student not in records yet, add them
      if (!updatedRecords.find(r => r.studentId._id === studentId)) {
        updatedRecords.push({ studentId, status });
      }

      await dashboardService.markAttendance(classData._id, attendanceDate, updatedRecords.map(r => ({
        studentId: r.studentId._id || r.studentId,
        status: r.status
      })));
      
      fetchData();
    } catch (error) {
      console.error('Error updating attendance:', error);
    } finally {
      setIsUpdatingAttendance(false);
    }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    try {
      if (gradingModal.isQuiz) {
        await dashboardService.gradeQuizSubmission(
          gradingModal.submission._id, 
          parseFloat(gradingModal.grade), 
          gradingModal.feedback
        );
      } else {
        await dashboardService.gradeSubmission(
          gradingModal.submission._id, 
          gradingModal.grade, 
          gradingModal.feedback
        );
      }
      setGradingModal({ open: false, submission: null, grade: '', feedback: '', isQuiz: false });
      fetchData();
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };

  const handleGradeQuizSubmission = async (submissionId, score, feedback) => {
    try {
      await dashboardService.gradeQuizSubmission(submissionId, score, feedback);
      fetchData();
      const subs = await dashboardService.getQuizSubmissions(activeQuiz._id);
      setActiveQuizSubmissions(subs || []);
      const updatedSub = subs.find(s => s._id === submissionId);
      if (updatedSub) {
        setActiveSubmissionForReview(updatedSub);
      }
    } catch (error) {
      console.error('Error grading quiz:', error);
      throw error;
    }
  };

  const handleStepSubmission = (direction) => {
    if (!activeSubmissionForReview || !activeQuizSubmissions.length) return;
    const currentIndex = activeQuizSubmissions.findIndex(s => s._id === activeSubmissionForReview._id);
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % activeQuizSubmissions.length;
    } else {
      nextIndex = (currentIndex - 1 + activeQuizSubmissions.length) % activeQuizSubmissions.length;
    }
    setActiveSubmissionForReview(activeQuizSubmissions[nextIndex]);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await dashboardService.submitAssignment(classData._id, submissionModal.assignment._id, {
        content: submissionModal.content
      });
      setSubmissionModal({ open: false, assignment: null, content: '', isReadOnly: false });
      fetchData();
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderStream = () => (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn(
        "h-32 sm:h-48 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 relative overflow-hidden shadow-xl shadow-teal-100/20 bg-gradient-to-br",
        classData.color || 'from-teal-600 to-teal-400'
      )}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-end h-full">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{classData.name}</h1>
          <p className="text-white/80 font-bold mt-1 sm:mt-2 text-sm sm:text-lg">{classData.section || 'General'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Left Info Panel */}
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Class Code</h3>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-teal-600 tracking-widest uppercase">{classData.code}</span>
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><Layers className="w-4 h-4 text-slate-400" /></button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Upcoming</h3>
            <div className="space-y-4">
              {assignments.filter(a => a.dueDate && new Date(a.dueDate) >= new Date()).length === 0 ? (
                <p className="text-xs text-slate-400 font-medium leading-relaxed">No work due soon!</p>
              ) : assignments.filter(a => a.dueDate && new Date(a.dueDate) >= new Date()).slice(0, 2).map(a => (
                <div key={a._id} className="group cursor-pointer">
                   <p className="text-[10px] font-black text-rose-500 uppercase">{new Date(a.dueDate).toLocaleDateString()}</p>
                   <p className="text-xs font-bold text-slate-700 group-hover:text-teal-600 transition-colors line-clamp-1">{a.title}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveSubTab('Classwork')}
              className="text-teal-600 font-black text-[10px] uppercase tracking-widest mt-4 hover:underline"
            >
              View All
            </button>
          </div>
        </div>

        {/* Right Stream Panel */}
        <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
          {/* Post Box */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
            <form onSubmit={handlePostAnnouncement}>
              <div className="flex gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-xl sm:rounded-2xl shrink-0 flex items-center justify-center text-white font-black">
                  {user?.username?.charAt(0)}
                </div>
                <textarea 
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="Announce something to your class..."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 font-bold outline-none transition-all resize-none min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                />
              </div>
              <div className="flex justify-between items-center mt-4 pl-14 sm:pl-16">
                 <button type="button" className="p-2 text-slate-400 hover:text-teal-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                 <button 
                  disabled={isPosting || !newAnnouncement.trim()}
                  className="bg-teal-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center gap-2"
                 >
                   {isPosting ? 'Posting...' : 'Post'}
                   <Send className="w-4 h-4" />
                 </button>
              </div>
            </form>
          </div>

          {/* Announcements List */}
          <div className="space-y-6">
            {announcements.map((ann) => (
              <div key={ann._id} className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-black">
                      {ann.author?.username?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-none text-sm sm:text-base">{ann.author?.username}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><MoreVertical className="w-5 h-5 text-slate-300" /></button>
                </div>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-b border-slate-50">
                  <p className="text-slate-600 font-medium whitespace-pre-wrap text-sm sm:text-base">{ann.content}</p>
                </div>
                
                {/* Comments Section */}
                {ann.comments?.length > 0 && (
                  <div className="px-5 sm:px-6 py-4 space-y-4 bg-slate-50/30">
                    {ann.comments.map((comment, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
                          {comment.author?.username?.charAt(0)}
                        </div>
                        <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black text-slate-900">{comment.author?.username}</span>
                              <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(comment.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className="text-xs text-slate-600 font-medium">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 bg-slate-50/50 flex items-center gap-4">
                   <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
                    {user?.username?.charAt(0)}
                   </div>
                   <input 
                    type="text" 
                    value={commentText[ann._id] || ''}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [ann._id]: e.target.value }))}
                    placeholder="Add class comment..." 
                    className="bg-transparent text-xs font-bold outline-none flex-1" 
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment(ann._id)}
                   />
                   <button 
                    onClick={() => handlePostComment(ann._id)}
                    disabled={!commentText[ann._id]?.trim()}
                    className="p-2 text-slate-300 hover:text-teal-600 transition-colors disabled:opacity-30"
                   >
                    <Send className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
            {announcements.length === 0 && !isLoading && (
               <div className="text-center py-20 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 border-dashed">
                  <p className="text-slate-400 font-medium">No announcements yet.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClasswork = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-2xl font-black text-slate-900">Classwork</h2>
         {user?.role === 'teacher' && (
           <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center gap-2"
           >
              <Plus className="w-4 h-4" /> Create
           </button>
         )}
      </div>

      <div className="space-y-12">
        {/* Assignments Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
             <FileText className="w-4 h-4" /> Assignments
          </h3>
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <p className="text-center py-12 text-slate-400 font-medium italic">No assignments posted yet.</p>
            ) : assignments.map((task) => {
              const submission = submissions.find(s => s.assignmentId?._id === task._id && s.studentId?._id === (user?.id || user?._id));
              const isSubmittedByStudent = user.role === 'student' && submission;
              return (
                <div 
                  key={task._id} 
                  onClick={() => {
                    if (user.role === 'student') {
                      if (!submission) {
                        setSubmissionModal({ open: true, assignment: task, content: '', isReadOnly: false });
                      }
                      // If submitted, do nothing (student cannot enter submission flow again)
                    } else {
                      setSubmissionModal({ open: true, assignment: task, content: '', isReadOnly: true });
                    }
                  }}
                  className={cn(
                    "bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-start gap-6 group transition-all",
                    isSubmittedByStudent ? "cursor-default" : "cursor-pointer hover:border-teal-200"
                  )}
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-black text-slate-900 group-hover:text-teal-600 transition-colors">{task.title}</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">Posted {new Date(task.createdAt).toLocaleDateString()}</p>
                    </div>

                    {isSubmittedByStudent && (
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                          <span>Your Submission</span>
                          <span>Submitted {new Date(submission.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 font-medium whitespace-pre-wrap">{submission.content}</p>
                        
                        {submission.status === 'Graded' && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-2">
                            <div className="flex justify-between items-center text-teal-600 font-black">
                              <span>Score Received: {submission.grade} / {task.points} Pts</span>
                            </div>
                            {submission.feedback && (
                              <p className="text-slate-500 font-bold italic">Feedback: "{submission.feedback}"</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0 min-w-[100px]">
                    {user.role === 'student' && submission ? (
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                        submission.status === 'Graded' ? "bg-teal-50 text-teal-600 border-teal-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      )}>
                         <CheckCircle2 className="w-4 h-4" /> {submission.status}
                      </div>
                    ) : task.dueDate ? (
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Due Date</p>
                        <p className="text-sm font-black text-rose-500">{new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Materials Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
             <Layers className="w-4 h-4" /> Materials
          </h3>
          <div className="space-y-4">
            {materials.length === 0 ? (
              <p className="text-center py-12 text-slate-400 font-medium italic">No materials available.</p>
            ) : materials.map((mat) => (
              <div key={mat._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-teal-200 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 group-hover:text-teal-600 transition-colors">{mat.title}</h4>
                  <p className="text-xs text-slate-400 font-bold mt-1">{mat.description || 'Reference material'}</p>
                </div>
                <MoreVertical className="w-5 h-5 text-slate-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
             <ClipboardCheck className="w-4 h-4" /> Quizzes
          </h3>
          <div className="space-y-4">
            {quizzes.length === 0 ? (
              <p className="text-center py-12 text-slate-400 font-medium italic">No quizzes launched yet.</p>
            ) : quizzes.map((qz) => {
              const quizSub = quizSubmissions.find(s => s.quizId === qz._id || s.quizId?._id === qz._id || (s.quizId && s.quizId._id === qz._id));
              return (
                <div 
                  key={qz._id} 
                  onClick={async () => {
                    setActiveQuiz(qz);
                    if (user.role === 'teacher') {
                      setIsLoading(true);
                      try {
                        const subs = await dashboardService.getQuizSubmissions(qz._id);
                        setActiveQuizSubmissions(subs || []);
                      } catch (error) {
                        console.error('Failed to fetch quiz submissions:', error);
                      } finally {
                        setIsLoading(false);
                      }
                    }
                  }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{qz.title}</h4>
                    <p className="text-xs text-slate-400 font-bold mt-1">{qz.questions?.length} Questions • {qz.totalPoints} Points</p>
                  </div>
                  <div className="text-right">
                     <span className={cn(
                       "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                       user.role !== 'student' 
                         ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                         : quizSub 
                           ? quizSub.status === 'Graded' 
                             ? "bg-teal-50 text-teal-600 border border-teal-100" 
                             : "bg-blue-50 text-blue-600 border border-blue-100"
                           : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                     )}>
                       {user.role !== 'student' 
                         ? 'Preview Quiz' 
                         : quizSub 
                           ? quizSub.status === 'Graded' 
                             ? `Graded: ${quizSub.score}/${qz.totalPoints}` 
                             : 'Submitted'
                           : 'Start Attempt'}
                     </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPeople = () => (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Teachers */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b-2 border-teal-600 pb-2">
          <h2 className="text-3xl font-black text-teal-600">Teachers</h2>
        </div>
        <div className="space-y-4">
          {people.teachers.map((t) => (
            <div key={t._id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors group">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black overflow-hidden border-2 border-white shadow-sm shrink-0">
                 {t.profilePicture ? (
                   <img src={t.profilePicture} alt="teacher" className="w-full h-full object-cover" />
                 ) : (
                   t.username.charAt(0).toUpperCase()
                 )}
              </div>
              <span className="font-black text-slate-800 text-lg">{t.username}</span>
              <button className="ml-auto p-2 text-slate-300 hover:text-teal-600 transition-colors"><MessageSquare className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
      </section>

      {/* Students */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-2">
          <h2 className="text-3xl font-black text-slate-900">Students</h2>
          <span className="text-sm font-bold text-slate-400">{people.students.length} students</span>
        </div>
        <div className="space-y-2">
          {people.students.length === 0 ? (
            <p className="text-center py-12 text-slate-400 font-medium italic">No students joined yet.</p>
          ) : people.students.map((s) => (
            <div key={s._id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors group">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 font-black overflow-hidden shrink-0">
                 {s.profilePicture ? (
                   <img src={s.profilePicture} alt="student" className="w-full h-full object-cover" />
                 ) : (
                   s.username.charAt(0).toUpperCase()
                 )}
              </div>
              <span className="font-bold text-slate-700">{s.username}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderGrades = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900">Gradebook</h2>
        <div className="flex gap-2">
           <div className="bg-teal-50 text-teal-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <Trophy className="w-4 h-4" /> Class Avg: 84%
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="text-left py-6 px-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">Student</th>
              {assignments.map(asgn => (
                <th key={asgn._id} className="text-center py-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[120px]">
                  {asgn.title}
                  <p className="text-[8px] mt-1 text-slate-400 font-bold">{asgn.points} pts</p>
                </th>
              ))}
              {quizzes.map(qz => (
                <th key={qz._id} className="text-center py-6 px-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest min-w-[120px] bg-emerald-50/20">
                  {qz.title} (Quiz)
                  <p className="text-[8px] mt-1 text-emerald-500 font-bold">{qz.totalPoints} pts</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.students.map(student => (
              <tr key={student._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                      {student.username.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">{student.username}</span>
                  </div>
                </td>
                {assignments.map(asgn => {
                  const sub = submissions.find(s => s.studentId?._id === student._id && s.assignmentId?._id === asgn._id);
                  return (
                    <td key={asgn._id} className="py-4 px-4 text-center">
                      {sub ? (
                        <button 
                          disabled={user.role !== 'teacher'}
                          onClick={() => setGradingModal({ open: true, submission: sub, grade: sub.grade !== undefined ? sub.grade : '', feedback: sub.feedback || '', isQuiz: false })}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-black transition-all",
                            sub.status === 'Graded' ? "bg-teal-50 text-teal-600" : "bg-amber-50 text-amber-600 border border-amber-100"
                          )}
                        >
                          {sub.grade !== undefined ? `${sub.grade}/${asgn.points}` : 'Ungraded'}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 italic">No Submission</span>
                      )}
                    </td>
                  );
                })}
                {quizzes.map(qz => {
                  const sub = quizSubmissions.find(s => (s.studentId?._id === student._id || s.studentId === student._id) && (s.quizId?._id === qz._id || s.quizId === qz._id));
                  return (
                    <td key={qz._id} className="py-4 px-4 text-center bg-emerald-50/10">
                      {sub ? (
                        <button 
                          disabled={user.role !== 'teacher'}
                          onClick={() => setGradingModal({ open: true, submission: sub, grade: sub.score !== undefined ? sub.score : '', feedback: sub.feedback || '', isQuiz: true })}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-black transition-all",
                            sub.status === 'Graded' ? "bg-teal-50 text-teal-600 border border-teal-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          )}
                        >
                          {sub.score !== undefined ? `${sub.score}/${qz.totalPoints}` : 'Ungraded'}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 italic">No Attempt</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Attendance Tracker</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Daily presence logs for {classData.name}</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <input 
            type="date" 
            value={attendanceDate}
            onChange={(e) => {
              setAttendanceDate(e.target.value);
              // fetchData will trigger automatically due to activeSubTab dependency logic
            }}
            className="bg-transparent text-sm font-black outline-none border-none cursor-pointer"
           />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.students.map(student => {
            const record = attendance.find(r => r.studentId?._id === student._id);
            const status = record?.status || 'Present';

            return (
              <div key={student._id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between group hover:border-teal-200 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-slate-400">
                    {student.username.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{student.username}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {['Present', 'Absent', 'Late'].map(s => (
                    <button 
                      key={s}
                      disabled={user.role !== 'teacher' || isUpdatingAttendance}
                      onClick={() => handleUpdateAttendance(student._id, s)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all",
                        status === s 
                          ? (s === 'Present' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : 
                             s === 'Absent' ? "bg-rose-500 text-white shadow-lg shadow-rose-100" : 
                             "bg-amber-500 text-white shadow-lg shadow-amber-100")
                          : "bg-white text-slate-400 hover:bg-slate-100"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderQuizSubmissionsDashboard = () => {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <button 
              onClick={() => setActiveQuiz(null)}
              className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Classwork
            </button>
            <h2 className="text-3xl font-black text-slate-900">{activeQuiz.title} - Submissions</h2>
            <p className="text-slate-500 font-bold mt-1">{activeQuiz.questions?.length} Questions • {activeQuiz.totalPoints} Points</p>
          </div>
          <button 
            onClick={() => {
              setActiveSubmissionForReview({ isPreview: true });
            }}
            className="bg-slate-950 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-slate-900/10 shrink-0 self-start md:self-auto"
          >
            Preview Quiz Questions
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">Student</th>
                <th className="text-center py-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
                <th className="text-center py-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Score</th>
                <th className="text-right py-6 px-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {people.students.map(student => {
                const sub = activeQuizSubmissions.find(s => s.studentId?._id === student._id || s.studentId === student._id);
                return (
                  <tr key={student._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                          {student.username.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-700 block">{student.username}</span>
                          <span className="text-[9px] text-slate-400 font-medium">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        sub 
                          ? sub.status === 'Graded' ? "bg-teal-50 text-teal-600 border-teal-100" : "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-slate-50 text-slate-400 border-slate-100"
                      )}>
                        {sub ? sub.status : 'No Attempt'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-black text-slate-700">
                      {sub ? `${sub.score} / ${activeQuiz.totalPoints}` : '-'}
                    </td>
                    <td className="py-4 px-8 text-right">
                      {sub ? (
                        <button 
                          onClick={() => setActiveSubmissionForReview(sub)}
                          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-black text-xs hover:bg-teal-700 transition-all shadow-md shadow-teal-100"
                        >
                          Review & Comment
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 italic">Unsubmitted</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const maxPoints = gradingModal.open
    ? gradingModal.isQuiz 
      ? (gradingModal.submission?.quizId?.totalPoints || quizzes.find(q => q._id === (gradingModal.submission?.quizId?._id || gradingModal.submission?.quizId))?.totalPoints || 100)
      : (gradingModal.submission?.assignmentId?.points || 100)
    : 100;
  const quizObjForGrading = gradingModal.open && gradingModal.isQuiz 
    ? quizzes.find(q => q._id === (gradingModal.submission?.quizId?._id || gradingModal.submission?.quizId)) 
    : null;

  return (
    <div className="space-y-8 pb-20">
      {showQuizBuilder ? (
        <QuizBuilder 
          onSave={handleSaveQuiz} 
          onCancel={() => setShowQuizBuilder(false)} 
        />
      ) : activeQuiz ? (
        user.role === 'teacher' ? (
          activeSubmissionForReview ? (
            <QuizAttempt 
              quiz={activeQuiz} 
              submission={activeSubmissionForReview.isPreview ? null : activeSubmissionForReview}
              onCancel={() => setActiveSubmissionForReview(null)} 
              user={user}
              onGradeSubmission={handleGradeQuizSubmission}
              onChangeSubmission={handleStepSubmission}
            />
          ) : (
            renderQuizSubmissionsDashboard()
          )
        ) : (
          <QuizAttempt 
            quiz={activeQuiz} 
            submission={quizSubmissions.find(s => s.quizId === activeQuiz._id || s.quizId?._id === activeQuiz._id || (s.quizId && s.quizId._id === activeQuiz._id))}
            onSubmit={handleSubmitQuiz} 
            onCancel={() => setActiveQuiz(null)} 
            user={user}
          />
        )
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={onBack}
              className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-500 hover:text-teal-600 hover:border-teal-100 transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto">
               {['Stream', 'Classwork', 'Discussion', 'People', 'Grades', 'Attendance'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={cn(
                    "px-8 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap",
                    activeSubTab === tab ? "bg-teal-600 text-white shadow-lg shadow-teal-100" : "text-slate-500 hover:bg-slate-50"
                  )}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-40">
               <Loader2 className="w-10 h-10 animate-spin text-teal-600/30" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeSubTab === 'Stream' && renderStream()}
                {activeSubTab === 'Classwork' && renderClasswork()}
                {activeSubTab === 'Discussion' && <Chat classId={classData._id} user={user} />}
                {activeSubTab === 'People' && renderPeople()}
                {activeSubTab === 'Grades' && renderGrades()}
                {activeSubTab === 'Attendance' && renderAttendance()}
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}

      {/* Grading Modal */}
      <AnimatePresence>
        {gradingModal.open && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setGradingModal({ ...gradingModal, open: false })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{gradingModal.isQuiz ? 'Grade Quiz Attempt' : 'Grade Submission'}</h3>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Assessing {gradingModal.submission?.studentId?.username}</p>
                </div>
                <button onClick={() => setGradingModal({ ...gradingModal, open: false })} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveGrade} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      {gradingModal.isQuiz ? `Score / ${maxPoints}` : `Grade / ${maxPoints}`}
                    </label>
                    <input 
                      type="number" required
                      max={maxPoints}
                      value={gradingModal.grade}
                      onChange={(e) => setGradingModal({ ...gradingModal, grade: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold text-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Feedback</label>
                    <textarea 
                      value={gradingModal.feedback}
                      onChange={(e) => setGradingModal({ ...gradingModal, feedback: e.target.value })}
                      placeholder="Provide constructive feedback..."
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold resize-none h-32"
                    />
                  </div>
                  {gradingModal.isQuiz && quizObjForGrading && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl max-h-48 overflow-y-auto space-y-2 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Question Breakdown</p>
                      {quizObjForGrading.questions.map((q, idx) => {
                        const studentAns = gradingModal.submission?.answers?.find(a => a.questionIndex === idx);
                        const isCorrect = studentAns?.isCorrect;
                        return (
                          <div key={idx} className="flex justify-between items-center text-xs font-bold py-1 border-b border-slate-100 last:border-0">
                            <span className="text-slate-600 line-clamp-1 flex-1 pr-2">{idx + 1}. {q.question}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[9px] font-black uppercase shrink-0",
                              isCorrect ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                            )}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" onClick={() => setGradingModal({ ...gradingModal, open: false })}
                    className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                  >
                    Return Grade
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Create {createType === 'assignment' ? 'Assignment' : 'Material'}</h3>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Add new content to your classwork</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                  {['assignment', 'material', 'quiz'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setCreateType(type)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-xs font-black transition-all capitalize",
                        createType === type ? "bg-white shadow-sm text-teal-600" : "text-slate-500"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCreateContent} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Title</label>
                      <input 
                        type="text" required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={createType === 'assignment' ? "e.g. Weekly Quiz" : "e.g. Lecture Slides"}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide details for your students..."
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold resize-none h-32"
                      />
                    </div>
                    {createType === 'assignment' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Points</label>
                          <input 
                            type="number" required
                            value={formData.points}
                            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Topic</label>
                          <input 
                            type="text"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            placeholder="e.g. algebra"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                          />
                        </div>
                      </div>
                    )}
                    {createType === 'assignment' && (
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Due Date</label>
                        <input 
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button" onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isCreating || !formData.title}
                      className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-teal-100 hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : `Post ${createType}`}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submission Modal */}
      <AnimatePresence>
        {submissionModal.open && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setSubmissionModal({ ...submissionModal, open: false })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{submissionModal.isReadOnly ? 'Assignment Details' : 'Submit Work'}</h3>
                  <p className="text-slate-500 text-sm mt-1 font-medium">{submissionModal.assignment?.title}</p>
                </div>
                <button onClick={() => setSubmissionModal({ ...submissionModal, open: false })} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitAssignment} className="p-8 space-y-6">
                {submissionModal.isReadOnly ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Instructions</label>
                      <div className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 min-h-24 whitespace-pre-wrap">
                        {submissionModal.assignment?.instructions || submissionModal.assignment?.description || 'No description provided.'}
                      </div>
                    </div>
                    {submissionModal.content && (
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Submission</label>
                        <div className="w-full px-6 py-4 rounded-2xl bg-teal-50/30 border border-teal-100 font-bold text-slate-700 min-h-24 whitespace-pre-wrap">
                          {submissionModal.content}
                        </div>
                      </div>
                    )}
                    {submissionModal.assignment?.points !== undefined && (
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Points</label>
                        <p className="font-black text-slate-800">{submissionModal.assignment.points} Points</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Submission Content</label>
                      <textarea 
                        required
                        value={submissionModal.content}
                        onChange={(e) => setSubmissionModal({ ...submissionModal, content: e.target.value })}
                        placeholder="Type your response or paste links here..."
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold resize-none h-48"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  {submissionModal.isReadOnly ? (
                    <button 
                      type="button" onClick={() => setSubmissionModal({ ...submissionModal, open: false })}
                      className="w-full py-4 bg-slate-950 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all text-center"
                    >
                      Close Preview
                    </button>
                  ) : (
                    <>
                      <button 
                        type="button" onClick={() => setSubmissionModal({ ...submissionModal, open: false })}
                        className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isCreating || !submissionModal.content}
                        className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                      >
                        {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Turn In'}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
