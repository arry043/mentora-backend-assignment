# Mentora Backend API

A production-grade backend API for a mentorship platform where Parents manage Students, Mentors create Lessons, Students attend lessons via Bookings, and Mentors construct Sessions. An integrated LLM endpoint summarizes text using Google Gemini.

## Features & Architecture

- **Node.js + Express.js**: RESTful API built on the Express web framework.
- **MongoDB + Mongoose**: Data persistence using NoSQL documents.
- **Modular MVC with Service Layer**: Clear separation between routes, controllers, and business logic (services).
- **Zod Validation**: Robust runtime schema validation for incoming request bodies and parameters.
- **JWT Authentication**: Secure stateless token-based authorization.
- **Role-Based Access Control**: Route protection strictly differentiating `parent` and `mentor` capabilities.
- **AI Integration**: Text summarization powered by Google Gemini SDK (`gemini-2.5-flash`).
- **Security & Reliability**: Built-in rate limiting, Helmet HTTP headers, CORS, centralized generic error handling, Morgan request logging, and secure environment orchestration.

---

## Setup Instructions

### 1. Requirements
Ensure you have Node.js (v18+) and MongoDB instanced locally or remotely.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root based on `.env.example`:
```bash
cp .env.example .env
```
Fill in the following:
- `PORT=3000`
- `MONGO_URI=mongodb://localhost:27017/mentora` (or your MongoDB cluster string)
- `JWT_SECRET=your_super_secret_key`
- `GEMINI_API_KEY=your_gemini_api_key`

### 4. Run the Server
**Development mode (auto-restart over Nodemon):**
```bash
npm run dev
```
**Production mode:**
```bash
npm start
```

---

## Project Structure

src/
 ├── controllers
 ├── services
 ├── models
 ├── routes
 ├── middleware
 └── validators

postman/
docs/

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Zod Validation
- Google Gemini API
- Postman (API testing)


## API Documentation

Interactive Postman Documentation:

https://documenter.getpostman.com/view/40266887/2sBXierZf4

## API Endpoints List

Base URL assumes `http://localhost:3000`

### Authentication (`/api/auth`)
- `POST /api/auth/signup`: Register a new user (`role` must be 'parent' or 'mentor')
- `POST /api/auth/login`: Authenticate an existing user returning a JWT token
- `GET /api/auth/me`: Fetch profile of currently authenticated user
- `GET /api/me`: Alias for profile endpoint (same behavior as `/api/auth/me`)

### Students (`/api/students`) _[Requires parent role]_
- `POST /api/students`: Create a new student (tied to the authenticated parent)
- `GET /api/students`: Fetch all students managed by the authenticated parent

### Lessons (`/api/lessons`)
- `GET /api/lessons`: Fetch all available lessons _[Requires Auth]_
- `POST /api/lessons`: Create a new lesson package _[Requires mentor role]_.
  Required fields: `title`, `description`, `mentorId` (must match authenticated mentor).

### Bookings (`/api/bookings`) _[Requires parent role]_
- `POST /api/bookings`: Book a student into a specific lesson package.

### Sessions (`/api/sessions`) _[Requires mentor role]_
- `POST /api/sessions`: Add a new session instance to a lesson (only the lesson's mentor can execute this).
- `GET /api/lessons/:lessonId/sessions`: Fetch all instances tied to a given lesson _[Requires Auth]_.
- `POST /api/sessions/:sessionId/join`: Parent joins a student to a session.
  Required field: `studentId` (student must belong to parent and be booked to the session's lesson).

### LLM Summarization (`/api/llm/`) _[Requires Auth]_
- `POST /api/llm/summarize`: Submits a text payload and returns an AI-powered summary (Rate Limit: 10 requests / min / IP).
  Success response:
  ```json
  {
    "summary": "...",
    "model": "gemini-2.5-flash"
  }
  ```
  Validation behavior:
  - `400` when `text` is missing/empty/too short (`< 50` chars)
  - `413` when `text` exceeds `10000` characters
  - `502/503` for provider/configuration failures

---

## LLM Testing (curl)

1. Login and copy a valid JWT token:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mentor@example.com",
    "password": "SecurePass123"
  }'
```

2. Test successful summarization:
```bash
curl -X POST http://localhost:3000/api/llm/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "text": "Mentora connects parents, students, and mentors for structured learning journeys. Parents can manage student profiles, browse lessons, and make bookings. Mentors can create lessons and add sessions with topical summaries. The backend uses JWT authentication and role-based authorization to secure each workflow."
  }'
```

3. Test short text validation (`400`):
```bash
curl -X POST http://localhost:3000/api/llm/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "text": "too short text"
  }'
```

4. Test oversized text validation (`413`):
```bash
LONG_TEXT=$(python3 -c "print('A'*10001)")
curl -X POST http://localhost:3000/api/llm/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d "{\"text\":\"$LONG_TEXT\"}"
```

## LLM Assumptions & Limits

- Provider: Google Gemini (`gemini-2.5-flash`) via `GEMINI_API_KEY`.
- Prompting style is consistent: summary should be either `3-6 bullet points` or `a short paragraph (<= 120 words)`.
- Input length constraints:
  - `< 50` characters => `400`
  - `> 10000` characters => `413`
- Runtime failure behavior:
  - upstream/provider errors => `502`
  - missing provider configuration/API key => `503`
- Minimal protection: rate limit is `10 requests/minute/IP` on `/api/llm/summarize`.

## Postman Documenter Sync Checklist

- Ensure your published Documenter is generated from the latest `mentora_postman_collection.json`.
- Confirm these endpoints appear in the docs:
  - `GET /api/me`
  - `POST /api/sessions/:sessionId/join`
  - `POST /api/llm/summarize`
- Confirm these collection requests are present for LLM coverage:
  - `Summarize Text`
  - `Summarize Text Too Short` (expects `400`)
  - `Summarize Text Too Large` (expects `413`)
- Re-publish Documenter after importing the latest collection changes.

## Automated API Testing

All endpoints were validated using Postman Collection Runner.

Test Summary:

- Total Tests: 30
- Passed: 30
- Failed: 0
- Errors: 0

## API Test Results (Screenshots)

### Authentication + Core Flow
<!-- Add GitHub image URL after uploading screenshot -->
![Authentication and Core Flow](https://raw.githubusercontent.com/arry043/mentora-backend-assignment/refs/heads/main/docs/Screenshot%202026-03-11%20at%2010.58.22%E2%80%AFAM.png)

### Sessions, Booking, and LLM Flow
<!-- Add GitHub image URL after uploading screenshot -->
![Sessions Booking and LLM Flow](https://raw.githubusercontent.com/arry043/mentora-backend-assignment/refs/heads/main/docs/Screenshot%202026-03-11%20at%2010.58.39%E2%80%AFAM.png)

### LLM Validation - Short Text (400)
<!-- Add GitHub image URL after uploading screenshot -->
![LLM Short Text 400](https://raw.githubusercontent.com/arry043/mentora-backend-assignment/refs/heads/main/docs/Screenshot%202026-03-11%20at%2011.01.51%E2%80%AFAM.png)

### LLM Validation - Large Text (413)
<!-- Add GitHub image URL after uploading screenshot -->
![LLM Large Text 413](https://raw.githubusercontent.com/arry043/mentora-backend-assignment/refs/heads/main/docs/Screenshot%202026-03-11%20at%2011.02.10%E2%80%AFAM.png)

---

## Assumptions Made
1. **Lessons Listing Strategy:** The original specification stated only `POST /lessons`. However, reasonably, parents require a way to see lessons before booking. I implemented `GET /lessons` to accomplish this.
2. **Session Fetching Architecture:** Implemented `GET /api/lessons/:lessonId/sessions` (nested route structure) conforming implicitly to standard REST sub-resource conventions as laid out in the requirements doc.
3. **Lesson Ownership Enforcement:** `mentorId` is required in the lesson payload and must match the authenticated mentor from JWT; this prevents creating lessons on behalf of another mentor.
4. **Session Attendance Rule:** A student can join a session only if the student is owned by the authenticated parent and already booked to the session's lesson.
5. **Password Security:** Sent responses utilizing the user's document carefully sanitize and drop `.password` before sending user information down the wire (`select('-password')` pattern).
