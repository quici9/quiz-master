import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import attemptService from '../../services/attempt.service';
import questionService from '../../services/question.service';
import quizService from '../../services/quiz.service';
import bookmarkService from '../../services/bookmark.service';
import { useTimer } from '../../hooks/useTimer';
import { useKeyboard } from '../../hooks/useKeyboard';
import QuestionDisplay from '../../components/quiz/QuestionDisplay';
import QuestionNavigator from '../../components/quiz/QuestionNavigator';
import Timer from '../../components/quiz/Timer';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAutoSave } from '../../hooks/useAutoSave';
import SaveIndicator from '../../components/common/SaveIndicator';
import RecoveryDialog from '../../components/common/RecoveryDialog';

export default function QuizRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const resumeAttemptId = searchParams.get('attemptId');

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(resumeAttemptId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const hasInitialized = useRef(false);

  // Review Mode state
  const [reviewMode, setReviewMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [firstAnswerGiven, setFirstAnswerGiven] = useState({});
  const [feedbackHistory, setFeedbackHistory] = useState({}); // Store feedback for each question

  const { time, start: startTimer, stop: stopTimer, setTime } = useTimer(0, quiz?.timeLimit, () => handleAutoSubmit());

  // Auto-save integration
  const quizData = { currentQuestionIndex: currentIndex, answers, timeSpent: time };
  const { isSaving, lastSaved, error: saveError, loadSavedProgress, clearSavedProgress } = useAutoSave(attemptId, quizData);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveredData, setRecoveredData] = useState(null);

  // Check for saved progress on mount/init
  useEffect(() => {
    const checkRecovery = async () => {
      if (attemptId && !loading && !submitting) {
        const saved = await loadSavedProgress();
        if (saved && saved.timestamp > Date.now() - 24 * 60 * 60 * 1000) { // Only recover if less than 24h old
          // Simple check: if saved answers count > current answers count, or just offer it
          if (Object.keys(saved.answers || {}).length > Object.keys(answers).length) {
            setRecoveredData(saved);
            setShowRecovery(true);
          }
        }
      }
    };
    checkRecovery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, loading]);

  const handleRecover = () => {
    if (recoveredData) {
      if (recoveredData.answers) setAnswers(recoveredData.answers);
      if (recoveredData.currentQuestionIndex) setCurrentIndex(recoveredData.currentQuestionIndex);
      if (recoveredData.timeSpent) setTime(recoveredData.timeSpent);
      toast.success('Progress restored!');
    }
    setShowRecovery(false);
  };

  const handleDiscardRecovery = () => {
    clearSavedProgress();
    setShowRecovery(false);
  };

  useEffect(() => {
    // Use quiz ID as key to track initialization per quiz
    const currentQuizKey = `quiz_${id}`;

    // Prevent double initialization from React StrictMode
    if (hasInitialized.current === currentQuizKey) return;

    hasInitialized.current = currentQuizKey;
    initializeQuiz();

    // No cleanup - let the ref persist to prevent double calls
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Tab visibility tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && attemptId) {
        attemptService.trackTabSwitch(attemptId).catch(() => { });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attemptId]);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (attemptId && !submitting) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [attemptId, submitting]);

  const initializeQuiz = async () => {
    setLoading(true);
    try {
      if (resumeAttemptId) {
        // Resume existing attempt
        const attemptRes = await attemptService.getAttemptById(resumeAttemptId);
        if (attemptRes.data.status !== 'IN_PROGRESS') {
          toast.error('Attempt already completed');
          navigate(`/quiz/result/${resumeAttemptId}`);
          return;
        }

        // Get config from configSnapshot
        const shuffleOptions = attemptRes.data.configSnapshot?.shuffleOptions || false;
        const reviewModeFromConfig = attemptRes.data.configSnapshot?.reviewMode || false;

        // Restore review mode
        if (reviewModeFromConfig) {
          setReviewMode(true);
        }

        // Load questions for this specific attempt with shuffle config
        const questionsRes = await questionService.getQuestionsByAttempt(resumeAttemptId, { shuffleOptions });

        setAttemptId(resumeAttemptId);
        setQuiz(attemptRes.data.quiz);
        setQuestions(questionsRes.data.questions);

        // Restore state
        const savedAnswers = attemptRes.data.answers || {};
        setAnswers(savedAnswers);

        // Restore timer
        const elapsed = attemptRes.data.timeElapsed || 0;
        setTime(elapsed);
        startTimer();

      } else {
        // Start new attempt (or resume if exists)
        const config = location.state?.config;
        const attemptRes = await attemptService.startAttempt({ quizId: id, config });
        const newAttemptId = attemptRes.data.attemptId;
        const isResumed = attemptRes.data.isResumed;

        // Set Review Mode from config
        if (config?.reviewMode) {
          setReviewMode(true);
        }

        if (isResumed) {
          // Automatically resume existing attempt
          toast('Resuming your previous attempt...', { icon: '🔄' });
          const attemptDetailRes = await attemptService.getAttemptById(newAttemptId);

          // Get config from configSnapshot
          const shuffleOptions = attemptDetailRes.data.configSnapshot?.shuffleOptions || false;
          const reviewModeFromConfig = attemptDetailRes.data.configSnapshot?.reviewMode || false;

          // Restore review mode
          if (reviewModeFromConfig) {
            setReviewMode(true);
          }

          const questionsRes = await questionService.getQuestionsByAttempt(newAttemptId, { shuffleOptions });

          setAttemptId(newAttemptId);
          setQuiz(attemptDetailRes.data.quiz || questionsRes.data.quiz);
          setQuestions(questionsRes.data.questions);

          // Restore answers and timer
          const savedAnswers = attemptDetailRes.data.answers || {};
          setAnswers(savedAnswers);
          const elapsed = attemptDetailRes.data.timeElapsed || 0;
          setTime(elapsed);
          startTimer();
        } else {
          // Brand new attempt - use config from response
          const shuffleOptions = attemptRes.data.config?.shuffleOptions || false;

          const [questionsRes, quizRes] = await Promise.all([
            questionService.getQuestionsByAttempt(newAttemptId, { shuffleOptions }),
            quizService.getQuizById(id)
          ]);

          setAttemptId(newAttemptId);
          setQuiz(quizRes.data);
          setQuestions(questionsRes.data.questions);
          setAnswers({});
          setTime(0);
          startTimer();
        }
      }
    } catch (error) {
      console.error('Quiz initialization error:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to start quiz';
      toast.error(errorMessage);
      // Don't navigate away immediately, give user a chance to see error
      setTimeout(() => {
        navigate(`/quizzes/${id}`);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = async (optionId) => {
    const question = questions[currentIndex];
    const questionId = question.id;

    // In Review Mode, only allow first answer
    if (reviewMode && firstAnswerGiven[questionId]) {
      return;
    }

    // Optimistic update
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));

    // Mark that first answer has been given for this question in Review Mode
    if (reviewMode) {
      setFirstAnswerGiven(prev => ({ ...prev, [questionId]: true }));
    }

    try {
      const response = await attemptService.answerQuestion(attemptId, {
        questionId,
        selectedOptionId: optionId,
      });

      // Show instant feedback in Review Mode
      if (reviewMode) {
        // Use backend response which includes isCorrect and correctOption
        const feedback = {
          isCorrect: response.data.isCorrect,
          explanation: response.data.correctOption?.explanation || question.explanation,
          correctOption: response.data.correctOption,
        };
        setCurrentFeedback(feedback);
        setShowFeedback(true);

        // Save feedback to history for this question
        setFeedbackHistory(prev => ({ ...prev, [questionId]: feedback }));
      }
    } catch (error) {
      console.error('Failed to save answer', error);
      // Optional: Revert optimistic update or show error indicator
    }
  };

  const toggleBookmark = async () => {
    const question = questions[currentIndex];
    const questionId = question.id;
    const isBookmarked = !!bookmarks[questionId];

    // Optimistic update
    setBookmarks(prev => ({ ...prev, [questionId]: !isBookmarked }));

    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(questionId);
      } else {
        await bookmarkService.createBookmark({ questionId });
      }
    } catch (error) {
      console.error('Failed to toggle bookmark', error);
      setBookmarks(prev => ({ ...prev, [questionId]: isBookmarked })); // Revert
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // In Review Mode, restore feedback if question was already answered
      if (reviewMode && questions[nextIndex]) {
        const nextQuestionId = questions[nextIndex].id;
        const previousFeedback = feedbackHistory[nextQuestionId];

        if (previousFeedback) {
          setCurrentFeedback(previousFeedback);
          setShowFeedback(true);
        } else {
          setShowFeedback(false);
          setCurrentFeedback(null);
        }
      } else {
        setShowFeedback(false);
        setCurrentFeedback(null);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);

      // In Review Mode, restore feedback if question was already answered
      if (reviewMode && questions[prevIndex]) {
        const prevQuestionId = questions[prevIndex].id;
        const previousFeedback = feedbackHistory[prevQuestionId];

        if (previousFeedback) {
          setCurrentFeedback(previousFeedback);
          setShowFeedback(true);
        } else {
          setShowFeedback(false);
          setCurrentFeedback(null);
        }
      } else {
        setShowFeedback(false);
        setCurrentFeedback(null);
      }
    } else {
      setShowFeedback(false);
      setCurrentFeedback(null);
    }
  };


  const handleJumpToQuestion = (index) => {
    setCurrentIndex(index);

    // In Review Mode, restore feedback if question was already answered
    if (reviewMode && questions[index]) {
      const targetQuestionId = questions[index].id;
      const previousFeedback = feedbackHistory[targetQuestionId];

      if (previousFeedback) {
        setCurrentFeedback(previousFeedback);
        setShowFeedback(true);
      } else {
        setShowFeedback(false);
        setCurrentFeedback(null);
      }
    } else {
      setShowFeedback(false);
      setCurrentFeedback(null);
    }
  };

  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    stopTimer();
    try {
      await attemptService.submitAttempt(attemptId, { timeSpent: time });
      await clearSavedProgress(); // Clear auto-save on submit
      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/result/${attemptId}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit quiz');
      setSubmitting(false);
      startTimer(); // Resume if failed
    }
  };

  const handleAutoSubmit = () => {
    toast('Time limit reached! Submitting quiz...', { icon: '⏳' });
    submitQuiz();
  };

  // Keyboard shortcuts
  useKeyboard({
    'ArrowRight': handleNext,
    'ArrowLeft': handlePrevious,
    'f': toggleBookmark,
    '1': () => { if (questions[currentIndex]?.options[0]) handleSelectOption(questions[currentIndex].options[0].id) },
    '2': () => { if (questions[currentIndex]?.options[1]) handleSelectOption(questions[currentIndex].options[1].id) },
    '3': () => { if (questions[currentIndex]?.options[2]) handleSelectOption(questions[currentIndex].options[2].id) },
    '4': () => { if (questions[currentIndex]?.options[3]) handleSelectOption(questions[currentIndex].options[3].id) },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No questions available for this quiz.</p>
          <Button onClick={() => navigate(`/quizzes/${id}`)}>Back to Quiz Details</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen pb-40 md:pb-20">
      {/* Header */}
      <header className="glass sticky top-0 z-20 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">{quiz.title}</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Timer timeElapsed={time} timeLimit={quiz.timeLimit} />
            <Button size="sm" onClick={handleSubmitClick} variant="primary">
              Submit Quiz
            </Button>
            <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} error={saveError} />
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-white/10 h-1">
          <div
            className="bg-primary-500 h-1 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <QuestionDisplay
            question={currentQuestion}
            selectedOptionId={answers[currentQuestion.id]}
            onSelectOption={handleSelectOption}
            isBookmarked={!!bookmarks[currentQuestion.id]}
            onToggleBookmark={toggleBookmark}
            disabled={reviewMode && firstAnswerGiven[currentQuestion.id]}
            reviewModeFeedback={reviewMode && showFeedback && currentFeedback ? {
              isCorrect: currentFeedback.isCorrect,
              correctOptionId: currentFeedback.correctOption?.id
            } : null}
          />

          {reviewMode && showFeedback && currentFeedback && (
            <div
              className={`fixed bottom-0 left-0 right-0 z-40 md:static p-4 md:p-6 border-t-2 md:border-2 md:rounded-2xl animate-slide-up md:animate-fade-in shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:shadow-none glass ${currentFeedback.isCorrect
                ? 'border-success-500 bg-success-50/95 dark:bg-gray-900/95 md:bg-success-50 md:dark:bg-success-500/10 dark:border-success-500/50'
                : 'border-danger-500 bg-danger-50/95 dark:bg-gray-900/95 md:bg-danger-50 md:dark:bg-danger-500/10 dark:border-danger-500/50'
                }`}>
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${currentFeedback.isCorrect
                  ? 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400'
                  : 'bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400'
                  }`}>
                  {currentFeedback.isCorrect ? '✓' : '✗'}
                </div>
                <div>
                  <h4 className={`text-base md:text-lg font-bold ${currentFeedback.isCorrect ? 'text-success-700 dark:text-success-400' : 'text-danger-700 dark:text-danger-400'
                    }`}>
                    {currentFeedback.isCorrect ? 'Correct!' : 'Incorrect'}
                  </h4>
                  {!currentFeedback.isCorrect && currentFeedback.correctOption && (
                    <p className="text-sm text-gray-600 dark:text-white/60">
                      Correct answer: <span className="font-semibold">{currentFeedback.correctOption.label}</span>
                    </p>
                  )}
                </div>
              </div>

              {currentFeedback.explanation && (
                <div className="mb-4">
                  <h5 className="text-xs md:text-sm font-medium text-gray-900 dark:text-white/80 mb-1">💡 Explanation:</h5>
                  <p className="text-sm md:text-base text-gray-700 dark:text-white/70 leading-relaxed">{currentFeedback.explanation}</p>
                </div>
              )}

              {/* Show Submit or Next button based on completion */}
              {(currentIndex === questions.length - 1 && Object.keys(answers).length === questions.length) ? (
                <Button
                  onClick={handleSubmitClick}
                  variant="primary"
                  className="w-full justify-center"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className="w-full justify-center"
                >
                  {currentIndex === questions.length - 1 ? 'Last Question' : 'Next Question'}
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}

          {/* Navigation buttons - hide in review mode when feedback is showing */}
          {!(reviewMode && showFeedback) && (
            <div className="flex justify-between items-center">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {/* Show Submit or Next button based on completion */}
              {(currentIndex === questions.length - 1 && Object.keys(answers).length === questions.length) ? (
                <Button
                  variant="primary"
                  onClick={handleSubmitClick}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                >
                  Next
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            bookmarks={bookmarks}
            onJumpTo={handleJumpToQuestion}
            className="sticky top-24"
          />
        </div>
      </div>

      <Modal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Submit Quiz?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            You have answered <span className="font-bold text-gray-900 dark:text-white">{Object.keys(answers).length}</span> out of <span className="font-bold text-gray-900 dark:text-white">{questions.length}</span> questions.
          </p>

          {Object.keys(answers).length < questions.length && (
            <p className="text-yellow-800 bg-yellow-50 border border-yellow-200 dark:text-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20 p-4 rounded-xl text-sm">
              ⚠️ You have unanswered questions. Are you sure you want to submit?
            </p>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
              Keep Playing
            </Button>
            <Button variant="primary" onClick={submitQuiz} loading={submitting}>
              Yes, Submit
            </Button>
          </div>
        </div>
      </Modal>

      <RecoveryDialog
        isOpen={showRecovery}
        onRecover={handleRecover}
        onDiscard={handleDiscardRecovery}
        lastSavedTime={recoveredData?.timestamp}
      />
    </div >
  );
}
