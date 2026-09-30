import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BookOpen, Sparkles, Award, CheckCircle2, XCircle, ArrowRight, RefreshCw, HelpCircle, ShieldCheck } from 'lucide-react';

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
    try {
      const result = await api.submitQuizAttempt(activeQuiz.id, selectedAnswers);
      setQuizResult(result);
      if (user) {
        setUser((prev) => ({ ...prev, points: result.totalPoints }));
      }
      showToast(`Quiz Completed! You earned +${result.score} points.`, 'success', 'Points Awarded 🎉');
    } catch (err) {
      showToast('Failed to submit quiz attempt.', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading waste awareness center..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Interactive Civic Education Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Waste Awareness & Quizzes</h1>
        <p className="text-slate-300 text-sm">
          Learn waste segregation rules, test your knowledge with interactive image-based quizzes, and earn civic points.
        </p>
      </div>

      {/* Segregation Guide Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BorderGlowCard className="p-5 border-l-4 border-l-emerald-500">
          <div className="font-bold text-emerald-300 text-sm mb-1">🟢 Wet / Organic Waste</div>
          <p className="text-xs text-slate-300">Food scraps, banana peels, vegetable pulp, tea leaves. Goes to composting bin.</p>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 border-l-4 border-l-sky-500">
          <div className="font-bold text-sky-300 text-sm mb-1">🔵 Dry / Recyclable Waste</div>
          <p className="text-xs text-slate-300">Clean plastic bottles, cardboard boxes, tin cans, paper. Sent to recycling facilities.</p>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 border-l-4 border-l-amber-500">
          <div className="font-bold text-amber-300 text-sm mb-1">⚫ E-Waste & Electronics</div>
          <p className="text-xs text-slate-300">Circuit boards, cables, monitors, battery packs. Requires authorized collection.</p>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 border-l-4 border-l-rose-500">
          <div className="font-bold text-rose-300 text-sm mb-1">🔴 Hazardous Waste</div>
          <p className="text-xs text-slate-300">Chemical cleaners, fluorescent tubes, medical packaging. Special handling needed.</p>
        </BorderGlowCard>
      </div>

      {/* Quiz Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-400" /> Interactive Knowledge Quizzes
        </h2>

        {!activeQuiz ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((q) => (
              <BorderGlowCard key={q.id} className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {q.category}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> +{q.points} Points
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{q.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{q.description}</p>
                  <div className="text-[11px] text-slate-400 font-semibold pt-1">
                    {q.questions.length} Interactive Questions (MCQ, Image & Scenario)
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(q)}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  Start Quiz Now <ArrowRight className="w-4 h-4" />
                </button>
              </BorderGlowCard>
            ))}
          </div>
        ) : (
          /* Active Quiz Engine */
          <BorderGlowCard className="p-8 max-w-3xl mx-auto space-y-6">
            {!quizResult ? (
              <div className="space-y-6">
                {/* Quiz Header */}
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-400">{activeQuiz.title}</span>
                    <h3 className="text-lg font-bold text-white">
                      Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel Quiz
                  </button>
                </div>

                {/* Current Question */}
                {(() => {
                  const currentQ = activeQuiz.questions[currentQuestionIdx];
                  return (
                    <div className="space-y-5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950 text-[11px] text-emerald-300 font-mono">
                        Type: {currentQ.type}
                      </div>

                      {currentQ.imageUrl && (
                        <img
                          src={currentQ.imageUrl}
                          alt="Quiz Question Visual"
                          className="w-full h-56 object-cover rounded-xl border border-emerald-500/30"
                        />
                      )}

                      <p className="text-base font-bold text-white">{currentQ.question}</p>

                      <div className="space-y-2.5">
                        {currentQ.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                              selectedAnswers[currentQuestionIdx] === optIdx
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                                : 'bg-emerald-950/30 border-emerald-500/15 text-slate-200 hover:border-emerald-500/40'
                            }`}
                          >
                            <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-emerald-900/60 mr-3 text-xs">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                    className="px-4 py-2 rounded-xl glass-panel text-slate-300 text-xs font-semibold disabled:opacity-30"
                  >
                    Previous Question
                  </button>

                  {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                    <button
                      disabled={selectedAnswers[currentQuestionIdx] === undefined}
                      onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-lg disabled:opacity-40"
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      disabled={selectedAnswers[currentQuestionIdx] === undefined}
                      onClick={handleSubmitQuiz}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl disabled:opacity-40"
                    >
                      Submit Quiz & Calculate Score
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Result Breakdown */
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Award className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-white">Quiz Complete!</h3>
                  <div className="text-3xl font-extrabold text-emerald-400">
                    +{quizResult.pointsEarned} Points Earned
                  </div>
                  <p className="text-xs text-slate-300">Total Account Points: {quizResult.totalPoints}</p>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-3 text-left pt-4 border-t border-emerald-500/20">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Answer Explanations:</h4>
                  {quizResult.breakdown.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        {item.isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Question {idx + 1}: Correct!
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Question {idx + 1}: Incorrect
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{item.explanation}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg"
                  >
                    Return to Quizzes List
                  </button>
                </div>
              </div>
            )}
          </BorderGlowCard>
        )}
      </div>
    </div>
  );
};
