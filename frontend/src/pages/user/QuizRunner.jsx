import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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

export default function QuizRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const { time, start: startTimer, stop: stopTimer, setTime } = useTimer(0, quiz?.timeLimit, () => handleAutoSubmit());

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

        // Load questions
        const questionsRes = await questionService.getQuestionsByQuiz(id);

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
        const attemptRes = await attemptService.startAttempt({ quizId: id });
        const newAttemptId = attemptRes.data.attemptId;
        const isResumed = attemptRes.data.isResumed;

        if (isResumed) {
          // Automatically resume existing attempt
          toast.info('Resuming your previous attempt...');
          const attemptDetailRes = await attemptService.getAttemptById(newAttemptId);
          const questionsRes = await questionService.getQuestionsByQuiz(id);

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
          // Brand new attempt
          const [questionsRes, quizRes] = await Promise.all([
            questionService.getQuestionsByQuiz(id),
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

    // Optimistic update
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));

    try {
      await attemptService.answerQuestion(attemptId, {
        questionId,
        selectedOptionId: optionId,
      });
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
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
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
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="glass sticky top-0 z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-white hidden sm:block">{quiz.title}</h1>
            <div className="text-sm text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Timer timeElapsed={time} timeLimit={quiz.timeLimit} />
            <Button size="sm" onClick={handleSubmitClick} variant="primary">
              Submit Quiz
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-white/10 h-1">
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
          />

          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              variant="primary"
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              Next
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            bookmarks={bookmarks}
            onJumpTo={setCurrentIndex}
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
          <p className="text-gray-300">
            You have answered <span className="font-bold text-white">{Object.keys(answers).length}</span> out of <span className="font-bold text-white">{questions.length}</span> questions.
          </p>

          {Object.keys(answers).length < questions.length && (
            <p className="text-yellow-200 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-sm">
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
    </div>
  );
}
