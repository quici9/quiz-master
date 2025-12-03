import { Injectable, BadRequestException } from '@nestjs/common';
import * as mammoth from 'mammoth';

export interface ParsedQuestion {
    order: number;
    text: string;
    options: { label: string; text: string }[];
    correctAnswer: string;
}

export interface ParsedQuiz {
    questions: ParsedQuestion[];
    totalParsed: number;
    totalValid: number;
    errors: { question: number; questionText: string; message: string }[];
}

@Injectable()
export class ParserService {
    async parseDocx(buffer: Buffer): Promise<ParsedQuiz> {
        try {
            const result = await mammoth.extractRawText({ buffer });
            const rawText = result.value;

            const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);

            const questions: ParsedQuestion[] = [];
            let currentQuestion: any = null;

            for (const line of lines) {
                // Match question: "Câu 1. [text]" or "Câu 1: [text]"
                const questionMatch = line.match(/^Câu\s+(\d+)[\.:]\s*(.+)$/i);
                if (questionMatch) {
                    if (currentQuestion) {
                        questions.push(currentQuestion);
                    }
                    currentQuestion = {
                        order: parseInt(questionMatch[1]),
                        text: questionMatch[2],
                        options: [],
                        correctAnswer: null
                    };
                    continue;
                }

                // Match option: "A. [text]" or "A: [text]"
                const optionMatch = line.match(/^([A-D])[\.:]\s*(.+)$/i);
                if (optionMatch && currentQuestion) {
                    const label = optionMatch[1].toUpperCase();
                    // Remove existing option with same label if exists (last one wins)
                    currentQuestion.options = currentQuestion.options.filter(opt => opt.label !== label);

                    currentQuestion.options.push({
                        label: label,
                        text: optionMatch[2]
                    });
                    continue;
                }

                // Match correct answer: "Đáp án: B"
                const answerMatch = line.match(/^Đáp án[:\s]*([A-D])/i);
                if (answerMatch && currentQuestion) {
                    currentQuestion.correctAnswer = answerMatch[1].toUpperCase();
                    continue;
                }
            }

            if (currentQuestion) {
                questions.push(currentQuestion);
            }

            const validQuestions: ParsedQuestion[] = [];
            const errors: { question: number; questionText: string; message: string }[] = [];

            questions.forEach(q => {
                const issues: string[] = [];
                if (!q.text) issues.push('Missing question text');
                if (q.options.length < 2) issues.push(`Insufficient options (found ${q.options.length}, need at least 2)`);
                if (!q.correctAnswer) issues.push('Missing correct answer');
                else if (!q.options.some(opt => opt.label === q.correctAnswer)) issues.push(`Correct answer ${q.correctAnswer} not found in options`);

                if (issues.length > 0) {
                    errors.push({
                        question: q.order,
                        questionText: q.text ? (q.text.length > 50 ? q.text.substring(0, 50) + '...' : q.text) : 'No text',
                        message: issues.join(', ')
                    });
                } else {
                    validQuestions.push(q);
                }
            });

            if (validQuestions.length === 0 && errors.length === 0) {
                throw new BadRequestException('No questions found in document');
            }

            return {
                questions: validQuestions,
                totalParsed: questions.length,
                totalValid: validQuestions.length,
                errors
            };
        } catch (error) {
            console.error('Parse error:', error);
            throw new BadRequestException('Failed to parse file: ' + error.message);
        }
    }
}
