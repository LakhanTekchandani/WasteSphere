import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BookOpen, Sparkles, Award, CheckCircle2, XCircle, ArrowRight, RefreshCw, HelpCircle, ShieldCheck, UserPlus } from 'lucide-react';

export const AwarenessPage = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await api.getQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  const handleSelectOption = (optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIdx
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    // If authenticated, persist to backend
    if (user) {
      try {
        const result = await api.submitQuizAttempt(activeQuiz.id, selectedAnswers);
        setQuizResult(result);
        setUser((prev) => ({ ...prev, points: result.totalPoints }));
        showToast(`Quiz Completed! You earned +${result.pointsEarned || result.score} points.`, 'success', 'Points Awarded 🎉');
      } catch (err) {
        showToast('Failed to submit quiz to backend.', 'error');
      }
    } else {
      // Guest User Attempt: Evaluate score locally
      let correctCount = 0;
      const breakdown = activeQuiz.questions.map((q, idx) => {
        const selected = selectedAnswers[idx];
        const isCorrect = selected === q.correctOption;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          selectedOption: selected,
          correctOption: q.correctOption,
          isCorrect,
          explanation: q.explanation || `Option ${String.fromCharCode(65 + q.correctOption)} is the correct answer.`
        };
      });

      const totalQ = activeQuiz.questions.length || 1;
      const pointsEarned = Math.round((correctCount / totalQ) * (activeQuiz.points || 50));

      setQuizResult({
        score: pointsEarned,
        pointsEarned,
        correctCount,
        totalQuestions: totalQ,
        totalPoints: pointsEarned,
        isGuest: true,
        breakdown
      });

      showToast(`Guest Quiz Completed! Score: ${correctCount}/${totalQ} (+${pointsEarned} pts).`, 'success', 'Quiz Finished 🎉');
    }
  };

  if (loading) return <LoadingSpinner label="Loading waste awareness center..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-3 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12332a] border border-[#00a884]/40 text-[#25d366] text-xs font-semibold backdrop-blur-md">
          <BookOpen className="w-4 h-4 text-[#25d366]" />
          <span>Interactive Civic Education Hub (Free Access for Everyone)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Waste Awareness & Quizzes</h1>
        <p className="text-[#8696a0] text-sm">
          Learn waste segregation rules, test your knowledge with interactive image-based quizzes, and earn civic points. No account needed to start!
        </p>
      </motion.div>

      {/* Segregation Guide Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BorderGlowCard className="p-5 border-l-4 border-l-[#25d366]">
          <div className="font-bold text-[#25d366] text-sm mb-1">🟢 Wet / Organic Waste</div>
          <p className="text-xs text-[#8696a0]">Food scraps, banana peels, vegetable pulp, tea leaves. Goes to composting bin.</p>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 border-l-4 border-l-[#34b7f1]">
          <div className="font-bold text-[#34b7f1] text-sm mb-1">🔵 Dry / Recyclable Waste</div>
          <p className="text-xs text-[#8696a0]">Clean plastic bottles, cardboard boxes, tin cans, paper. Sent to recycling facilities.</p>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 border-l-4 border-l-amber-500">
          <div className="font-bold text-amber-300 text-sm mb-1">⚫ E-Waste & Electronics</div>
          <p className="text-xs text-[#8696a0]">Circuit boards, cables, monitors, battery packs. Requires authorized collection.</p>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 border-l-4 border-l-[#ea4335]">
          <div className="font-bold text-[#ea4335] text-sm mb-1">🔴 Hazardous Waste</div>
          <p className="text-xs text-[#8696a0]">Chemical cleaners, fluorescent tubes, medical packaging. Special handling needed.</p>
        </BorderGlowCard>
      </div>

      {/* Quiz Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#25d366]" /> Interactive Knowledge Quizzes
        </h2>

        {!activeQuiz ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((q) => (
              <BorderGlowCard key={q.id} className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#12332a] text-[#25d366] border border-[#00a884]/30">
                      {q.category}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> +{q.points} Points
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{q.title}</h3>
                  <p className="text-xs text-[#8696a0] leading-relaxed">{q.description}</p>
                  <div className="text-[11px] text-[#8696a0] font-semibold pt-1">
                    {q.questions.length} Interactive Questions (MCQ, Image & Scenario)
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartQuiz(q)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] text-[#111b21] font-bold text-xs shadow-lg shadow-[#00a884]/20 flex items-center justify-center gap-2"
                >
                  Start Quiz Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </BorderGlowCard>
            ))}
          </div>
        ) : (
          /* Active Quiz Engine */
          <BorderGlowCard className="p-8 max-w-3xl mx-auto space-y-6">
            <AnimatePresence mode="wait">
              {!quizResult ? (
                <motion.div
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Quiz Header */}
                  <div className="flex items-center justify-between border-b border-[#2a3942] pb-4">
                    <div>
                      <span className="text-xs font-bold text-[#25d366]">{activeQuiz.title}</span>
                      <h3 className="text-lg font-bold text-white">
                        Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="text-xs text-[#8696a0] hover:text-white"
                    >
                      Cancel Quiz
                    </button>
                  </div>

                  {/* Current Question */}
                  {(() => {
                    const currentQ = activeQuiz.questions[currentQuestionIdx];
                    return (
                      <div className="space-y-5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#12332a] text-[11px] text-[#25d366] font-mono border border-[#00a884]/30">
                          Type: {currentQ.type}
                        </div>

                        {currentQ.imageUrl && (
                          <img
                            src={currentQ.imageUrl}
                            alt="Quiz Question Visual"
                            className="w-full h-56 object-cover rounded-xl border border-[#2a3942]"
                          />
                        )}

                        <p className="text-base font-bold text-white">{currentQ.question}</p>

                        <div className="space-y-2.5">
                          {currentQ.options.map((opt, optIdx) => (
                            <motion.button
                              key={optIdx}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleSelectOption(optIdx)}
                              className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                                selectedAnswers[currentQuestionIdx] === optIdx
                                  ? 'bg-[#12332a] border-[#25d366] text-[#25d366] shadow-md'
                                  : 'bg-[#111b21] border-[#2a3942] text-[#e9edef] hover:border-[#00a884]/50'
                              }`}
                            >
                              <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#1f2c34] mr-3 text-xs text-white">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              {opt}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#2a3942]">
                    <button
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                      className="px-4 py-2 rounded-xl glass-panel text-[#e9edef] hover:bg-[#1f2c34] text-xs font-semibold disabled:opacity-30"
                    >
                      Previous Question
                    </button>

                    {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={selectedAnswers[currentQuestionIdx] === undefined}
                        onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                        className="px-6 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-[#111b21] text-xs font-bold shadow-lg disabled:opacity-40"
                      >
                        Next Question →
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={selectedAnswers[currentQuestionIdx] === undefined}
                        onClick={handleSubmitQuiz}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] text-[#111b21] font-extrabold text-xs shadow-xl shadow-[#00a884]/20 disabled:opacity-40"
                      >
                        Submit Quiz & Calculate Score
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* Quiz Result Breakdown */
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#12332a] text-[#25d366] flex items-center justify-center mx-auto border border-[#00a884]/40">
                    <Award className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-white">Quiz Complete!</h3>
                    <div className="text-3xl font-extrabold text-[#25d366]">
                      +{quizResult.pointsEarned} Points Earned
                    </div>
                    <p className="text-xs text-[#8696a0]">
                      {user
                        ? `Total Account Points: ${quizResult.totalPoints}`
                        : `Guest Attempt Score: ${quizResult.pointsEarned} points awarded.`}
                    </p>
                  </div>

                  {!user && (
                    <div className="p-4 rounded-2xl bg-[#12332a]/50 border border-[#00a884]/40 text-xs text-slate-200 space-y-2">
                      <div className="flex items-center justify-center gap-2 font-bold text-[#25d366]">
                        <UserPlus className="w-4 h-4" /> Want to save your points and unlock citizen medals?
                      </div>
                      <p className="text-[#8696a0]">
                        Create a free account or sign in to build your environmental streak, earn Bronze/Silver/Gold medals, and qualify for official certificates!
                      </p>
                      <div className="pt-2 flex justify-center gap-3">
                        <Link
                          to="/register"
                          className="px-4 py-2 rounded-xl bg-[#00a884] text-[#111b21] font-bold text-xs shadow-md hover:scale-105 transition-transform"
                        >
                          Create Account & Claim Badges
                        </Link>
                        <Link
                          to="/login"
                          className="px-4 py-2 rounded-xl glass-panel text-[#e9edef] hover:bg-[#1f2c34] font-semibold text-xs"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Detailed Breakdown */}
                  <div className="space-y-3 text-left pt-4 border-t border-[#2a3942]">
                    <h4 className="text-xs font-bold text-[#8696a0] uppercase tracking-wider">Answer Explanations:</h4>
                    {quizResult.breakdown.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold">
                          {item.isCorrect ? (
                            <span className="text-[#25d366] flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Question {idx + 1}: Correct!
                            </span>
                          ) : (
                            <span className="text-[#ea4335] flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Question {idx + 1}: Incorrect
                            </span>
                          )}
                        </div>
                        <p className="text-[#8696a0] text-[11px] leading-relaxed">{item.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveQuiz(null)}
                      className="px-6 py-2.5 rounded-xl bg-[#00a884] text-[#111b21] font-bold text-xs shadow-lg"
                    >
                      Return to Quizzes List
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </BorderGlowCard>
        )}
      </div>
    </div>
  );
};
