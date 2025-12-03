import React from 'react';
import { clsx } from 'clsx';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function ReviewQuestion({ data, index }) {
  const { questionText, selectedOption, correctOption, isCorrect, allOptions } = data;

  return (
    <div className={clsx(
      "border rounded-xl p-6 mb-4 transition-colors backdrop-blur-sm",
      isCorrect
        ? "bg-success-500/10 border-success-500/20"
        : "bg-danger-500/10 border-danger-500/20"
    )}>
      <div className="flex items-start gap-3 mb-4">
        <div className="mt-1">
          {isCorrect ? (
            <CheckCircleIcon className="h-6 w-6 text-success-400" />
          ) : (
            <XCircleIcon className="h-6 w-6 text-danger-400" />
          )}
        </div>
        <div className="flex-grow">
          <h4 className="font-medium text-white mb-2">
            Question {index + 1}: <span className="font-normal text-white/90">{questionText}</span>
          </h4>
        </div>
      </div>

      <div className="ml-9 space-y-2">
        {allOptions.map((opt, i) => {
          const isSelected = selectedOption?.text === opt.text;
          const isTheCorrectOne = correctOption?.text === opt.text;

          return (
            <div
              key={i}
              className={clsx(
                "p-3 rounded-lg border flex items-center justify-between transition-colors",
                isTheCorrectOne ? "bg-success-500/20 border-success-500/30 text-white" :
                  isSelected && !isCorrect ? "bg-danger-500/20 border-danger-500/30 text-white" :
                    "bg-white/5 border-white/10 text-white/50"
              )}
            >
              <span className={clsx(
                "flex-grow",
                isTheCorrectOne && "font-medium text-success-200",
                isSelected && !isCorrect && "text-danger-200"
              )}>
                {String.fromCharCode(65 + i)}. {opt.text}
              </span>

              {isTheCorrectOne && (
                <span className="text-xs font-bold text-success-100 uppercase ml-2 px-2 py-1 bg-success-500/30 rounded border border-success-500/30">
                  Correct Answer
                </span>
              )}

              {isSelected && !isCorrect && (
                <span className="text-xs font-bold text-danger-100 uppercase ml-2 px-2 py-1 bg-danger-500/30 rounded border border-danger-500/30">
                  Your Answer
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!isCorrect && correctOption.explanation && (
        <div className="mt-4 ml-9 p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-white/80">
          <span className="font-bold text-primary-300">Explanation:</span> {correctOption.explanation}
        </div>
      )}
    </div>
  );
}

