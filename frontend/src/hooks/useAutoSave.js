import { useState, useEffect, useRef, useCallback } from 'react';
import { saveProgress, getProgress, clearProgress } from '../services/autoSave.service';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export const useAutoSave = (attemptId, quizData) => {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [error, setError] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Use refs to access latest data in intervals/callbacks without triggering re-renders
    const dataRef = useRef(quizData);

    useEffect(() => {
        dataRef.current = quizData;
        setHasUnsavedChanges(true);
    }, [quizData]);

    const saveToBackend = useCallback(async () => {
        if (!attemptId || !dataRef.current) return;

        try {
            setIsSaving(true);
            setError(null);

            const payload = {
                currentQuestionIndex: dataRef.current.currentQuestionIndex,
                answers: dataRef.current.answers,
                timeSpent: dataRef.current.timeSpent,
                timestamp: Date.now()
            };

            await saveProgress(attemptId, payload);

            // Also save to localStorage as backup
            localStorage.setItem(`quiz_progress_${attemptId}`, JSON.stringify(payload));

            setLastSaved(new Date());
            setHasUnsavedChanges(false);
        } catch (err) {
            console.error('Auto-save failed:', err);
            setError('Failed to save progress');
        } finally {
            setIsSaving(false);
        }
    }, [attemptId]);

    // Auto-save interval
    useEffect(() => {
        const interval = setInterval(() => {
            if (hasUnsavedChanges) {
                saveToBackend();
            }
        }, AUTOSAVE_INTERVAL);

        return () => clearInterval(interval);
    }, [hasUnsavedChanges, saveToBackend]);

    // Save on unmount/page leave
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                // We can't do async here reliably, but we can try beacon or sync XHR if really needed.
                // For now, rely on localStorage which is synchronous
                const payload = {
                    currentQuestionIndex: dataRef.current.currentQuestionIndex,
                    answers: dataRef.current.answers,
                    timeSpent: dataRef.current.timeSpent,
                    timestamp: Date.now()
                };
                localStorage.setItem(`quiz_progress_${attemptId}`, JSON.stringify(payload));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [attemptId, hasUnsavedChanges]);

    const loadSavedProgress = useCallback(async () => {
        if (!attemptId) return null;

        try {
            // Try backend first
            const response = await getProgress(attemptId);
            if (response && response.data && response.data.progress) {
                return response.data.progress;
            }

            // Fallback to localStorage
            const local = localStorage.getItem(`quiz_progress_${attemptId}`);
            if (local) {
                return JSON.parse(local);
            }
        } catch (err) {
            console.error('Failed to load progress:', err);
            // Try localStorage fallback on error
            const local = localStorage.getItem(`quiz_progress_${attemptId}`);
            if (local) {
                return JSON.parse(local);
            }
        }
        return null;
    }, [attemptId]);

    const clearSavedProgress = useCallback(async () => {
        if (!attemptId) return;
        try {
            await clearProgress(attemptId);
            localStorage.removeItem(`quiz_progress_${attemptId}`);
        } catch (err) {
            console.error('Failed to clear progress:', err);
        }
    }, [attemptId]);

    return {
        isSaving,
        lastSaved,
        error,
        saveNow: saveToBackend,
        loadSavedProgress,
        clearSavedProgress
    };
};
