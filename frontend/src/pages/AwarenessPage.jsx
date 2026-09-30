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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-primary/40 text-primary text-xs font-semibold backdrop-blur-md">
          <BookOpen className="w-4 h-4 text-primary" />
          <span>Interactive Civic Education Hub (Free Access for Everyone)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Waste Awareness & Quizzes</h1>
        <p className="text-muted-foreground text-sm">
          Learn waste segregation rules, test your knowledge with interactive image-based quizzes, and earn civic points. No account needed to start!
        </p>
      </motion.div>

      {/* Segregation Guide Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BorderGlowCard className="p-5 border-l-4 border-l-primary">
          <div className="font-bold text-primary text-sm mb-1">🟢 Wet / Organic Waste</div>
          <p className="text-xs text-muted-foreground">Food scraps, banana peels, vegetable pulp, tea leaves. Goes to composting bin.</p>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 border-l-4 border-l-primary">
          <div className="font-bold text-primary text-sm mb-1">🔵 Dry / Recyclable Waste</div>
          <p className="text-xs text-muted-foreground">Clean plastic bottles, cardboard boxes, tin cans, paper. Sent to recycling facilities.</p>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 border-l-4 border-l-accent">
          <div className="font-bold text-accent text-sm mb-1">⚫ E-Waste & Electronics</div>
          <p className="text-xs text-muted-foreground">Circuit boards, cables, monitors, battery packs. Requires authorized collection.</p>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 border-l-4 border-l-destructive">
          <div className="font-bold text-destructive text-sm mb-1">🔴 Hazardous Waste</div>
          <p className="text-xs text-muted-foreground">Chemical cleaners, fluorescent tubes, medical packaging. Special handling needed.</p>
        </BorderGlowCard>
      </div>

      {/* Quiz Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Interactive Knowledge Quizzes
        </h2>

        {!activeQuiz ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((q) => (
              <BorderGlowCard key={q.id} className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-primary border border-primary/30">
                      {q.category}
                    </span>
                    <span className="text-xs font-bold text-accent flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> +{q.points} Points
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{q.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{q.description}</p>
                  <div className="text-[11px] text-muted-foreground font-semibold pt-1">
                    {q.questions.length} Interactive Questions (MCQ, Image & Scenario)
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartQuiz(q)}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-lg flex items-center justify-center gap-2"
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
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <span className="text-xs font-bold text-primary">{activeQuiz.title}</span>
                      <h3 className="text-lg font-bold text-foreground">
                        Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel Quiz
                    </button>
                  </div>

                  {/* Current Question */}
                  {(() => {
                    const currentQ = activeQuiz.questions[currentQuestionIdx];
                    return (
                      <div className="space-y-5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-secondary text-[11px] text-primary font-mono border border-primary/30">
                          Type: {currentQ.type}
                        </div>

                        {currentQ.imageUrl && (
                          <img
                            src={currentQ.imageUrl}
                            alt="Quiz Question Visual"
                            className="w-full h-56 object-cover rounded-xl border border-border"
                          />
                        )}

                        <p className="text-base font-bold text-foreground">{currentQ.question}</p>

                        <div className="space-y-2.5">
                          {currentQ.options.map((opt, optIdx) => (
                            <motion.button
                              key={optIdx}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleSelectOption(optIdx)}
                              className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                                selectedAnswers[currentQuestionIdx] === optIdx
                                  ? 'bg-secondary border-primary text-primary shadow-md'
                                  : 'bg-muted/50 border-border text-foreground hover:border-primary/50'
                              }`}
                            >
                              <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-muted mr-3 text-xs text-foreground">
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
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                      className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold disabled:opacity-30"
                    >
                      Previous Question
                    </button>

                    {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={selectedAnswers[currentQuestionIdx] === undefined}
                        onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-lg disabled:opacity-40"
                      >
                        Next Question →
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={selectedAnswers[currentQuestionIdx] === undefined}
                        onClick={handleSubmitQuiz}
                        className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs shadow-xl disabled:opacity-40"
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
                  <div className="w-16 h-16 rounded-full bg-secondary text-primary flex items-center justify-center mx-auto border border-primary/40">
                    <Award className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-foreground">Quiz Complete!</h3>
                    <div className="text-3xl font-extrabold text-primary">
                      +{quizResult.pointsEarned} Points Earned
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user
                        ? `Total Account Points: ${quizResult.totalPoints}`
                        : `Guest Attempt Score: ${quizResult.pointsEarned} points awarded.`}
                    </p>
                  </div>

                  {!user && (
                    <div className="p-4 rounded-2xl bg-secondary/50 border border-primary/40 text-xs text-foreground space-y-2">
                      <div className="flex items-center justify-center gap-2 font-bold text-primary">
                        <UserPlus className="w-4 h-4" /> Want to save your points and unlock citizen medals?
                      </div>
                      <p className="text-muted-foreground">
                        Create a free account or sign in to build your environmental streak, earn Bronze/Silver/Gold medals, and qualify for official certificates!
                      </p>
                      <div className="pt-2 flex justify-center gap-3">
                        <Link
                          to="/register"
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:scale-105 transition-transform"
                        >
                          Create Account & Claim Badges
                        </Link>
                        <Link
                          to="/login"
                          className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted font-semibold text-xs"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Detailed Breakdown */}
                  <div className="space-y-3 text-left pt-4 border-t border-border">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Answer Explanations:</h4>
                    {quizResult.breakdown.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold">
                          {item.isCorrect ? (
                            <span className="text-primary flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Question {idx + 1}: Correct!
                            </span>
                          ) : (
                            <span className="text-destructive flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Question {idx + 1}: Incorrect
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">{item.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveQuiz(null)}
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-lg"
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
