# Queue Management Guide

## Overview
QuizMaster uses BullMQ for background job processing. This ensures that long-running tasks do not block the main API thread.

## Queues
- **quiz-processing**: Handles file parsing and import tasks.

## Job Types
### `parse-word`
- **Description**: Parses a Word document (.docx) to extract quiz questions.
- **Input**: Base64 encoded file buffer, quiz metadata.
- **Priority**: High

## Monitoring
- **Job Status API**: `GET /api/jobs/:id`
- **Returns**: Job state (active, completed, failed), result, or error.

## Error Handling
- **Retries**: Jobs are retried 3 times with exponential backoff.
- **Failed Jobs**: Kept for inspection (last 500).

## Troubleshooting
- **View Delayed Jobs**: Check Redis keys `bull:quiz-processing:delayed`
- **Retry Failed Job**: Currently requires manual intervention or re-upload.
