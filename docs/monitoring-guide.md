# Monitoring Guide

## Overview
QuizMaster uses a combination of structured logging and APM for observability.

## Logging
- **Library**: Winston
- **Format**: JSON (File), Human-readable (Console)
- **Locations**:
  - `backend/logs/error.log`: Error level logs
  - `backend/logs/combined.log`: All logs
- **Context**: Logs include timestamp, level, context (module), and message.

## APM (New Relic)
- **Agent**: New Relic Node.js agent
- **Configuration**: `backend/newrelic.js`
- **Metrics**:
  - Transaction times
  - Error rates
  - Database query performance
  - External service calls

## Health Checks
- **Backend**: `GET /api/health` (if implemented) or Docker healthcheck.
- **Redis**: Docker healthcheck (`redis-cli ping`).
- **Database**: Docker healthcheck (`pg_isready`).

## Alerts
- Configure alerts in New Relic dashboard for:
  - High error rate (> 5%)
  - High response time (> 500ms)
  - Downtime
