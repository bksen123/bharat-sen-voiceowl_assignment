# VoiceOwl Developer Evaluation Task

## Project Overview

**Role:** Node.js + TypeScript Developer (Full Stack optional with Angular)
**Focus:** Backend API, MongoDB, Swagger Documentation, Azure Integration, Pagination, Scalability, Frontend UI

This project implements a **minimal transcription API service** that accepts audio URLs, mocks transcription, stores results in MongoDB, and supports Azure Speech-to-Text integration  The project also includes a **Swagger API documentation(additional)** and a planned **Angular frontend** for testing and viewing transcriptions, and also added **additional GitHub workflow pipeline with YML file** to deploy automatically to any cloud server using the pipeline.

---

#### to run the follow the Backend:
```bash
#### To run the Backend

```bash
# Clone the repository
git clone https://github.com/bksen123/bharat-sen-voiceowl_assignment.git

# Navigate to the backend directory
cd bharat-sen-voiceowl_assignment/node-api

# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run start:dev

# Build the project (TypeScript compilation)
npm run build

# Run in production mode
npm run start:prod
```


**API Documentation:** http://localhost:4000/api-docs

**Angular Client (built version):** http://localhost:4000

**Notes:** You can access and use our Angular client source code in working mode. Follow the steps below to run the Angular project:

## Project Structure

```
voiceowl_assignment/
├─ src/
│  ├─ controllers/
│  │  └─ transcription.controller.ts
│  ├─ services/
│  │  └─ transcription.service.ts
│  ├─ routes/
│  │  └─ transcription.routes.ts
│  ├─ models/
│  │  └─ transcription.model.ts
│  ├─ middleware/
│  │  └─ authentication.ts
│  │  └─ multerMiddleware.ts
│  │  └─ messages.ts
│  ├─ swagger.ts
│  └─ app.ts
├─ tests/
│  └─ transcription.test.ts
├─ package.json
├─ tsconfig.json
├─ .env
└─ swagger.json / swagger.yaml
```

---

## Backend Implementation

### 1. API Endpoints

| Endpoint                         | Method | Description                                                                                                      |
| --------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| `/api/v1/transcription`           | POST   | Accepts an audio URL and mocks transcription. Stores `{ audioUrl, transcription, createdAt, source }` in MongoDB. |
| `/api/v1/transcription`           | GET    | Fetches transcriptions from the last 30 days with **pagination (additional)** using `page` and `limit` query parameters.       |
| `/api/v1/transcription`           | DELETE | Deletes a transcription by its `_id` (passed as a query parameter).                                              |
| `/api/v1/transcription/azure`     | POST   | Uses Azure Speech-to-Text (or mocks it) to transcribe audio and store the result in MongoDB.                     |


### 2. MongoDB

- Database: MongoDB (local)
- Collection: `Transcriptions`
- Document Schema:

```ts
{
  audioUrl: string;
  transcription: string;
  source: "mock" | "azure";
  createdAt: Date;
}
```

- Index recommendation: For **efficient querying of last 30 days** in a large dataset (>100M records):

```ts
db.transcriptions.createIndex({ createdAt: -1 });
```

---

### 3. Swagger Documentation(additional)

- Swagger UI is available at: `http://localhost:4000/api-docs`
- Swagger spec files: `swagger.json`
- Documents all API endpoints including request/response schemas and query parameters (pagination).

---


### 4. Azure Integration

- Azure Speech-to-Text endpoint: `/transcription/azure`
- Supports **mock** transcription because we don't have credentials and also are not provided
- Environment variables:

```env
AZURE_SPEECH_KEY=dummy-key
AZURE_REGION=dummy-region
```

- Optional: Multiple languages (e.g., `en-US`, `fr-FR`)

---

### 5. Scalability & System Design Notes

To handle **10k+ concurrent requests**:

1. **Caching:** Use Redis to cache recent transcriptions and reduce DB hits.
2. **Queues:** Offload transcription tasks to a job queue (BullMQ, RabbitMQ) for asynchronous processing.
3. **Containerization & Autoscaling:** Deploy backend in Docker containers, scale horizontally with Kubernetes.

Other improvements:

- Use MongoDB replica set for high availability
- Rate limiting for APIs
- Proper logging & monitoring

---

### 6. Frontend (Angular) Plan

- **Folder:** `/client-angular`
- **Tech:** Angular + TypeScript + HttpClient
- **Components:**
  - `TranscriptionFormComponent` → Input `audioUrl`, submit to POST `/transcription`
  - `TranscriptionListComponent` → Fetch GET `/transcription` with pagination, display list
- **Service:** `TranscriptionService` → Handles API calls

**Example UI Flow:**

1. User enters audio URL → submits form
2. Backend returns transcription ID → display success message
3. User can view **all transcriptions** in a paginated table
4. (Optional) Azure transcription displayed with source label

---

### 7. Running the Project

#### Backend:

```bash
cd bharat-sen-voiceowl_assignment/node-api
npm install
npm run start:dev   # runs in development with hot reload
npm run build       # TypeScript build
npm run start:prod
```

#### Swagger UI:

```
http://localhost:4000/api-docs
```

#### Angular Frontend(additional):

```bash
cd client-angular
npm install
ng serve

http://localhost:4200
```

---

### 8. Test Cases

- Tests are written using Jest in `/tests`
- Example: `transcription.test.ts` for POST and GET endpoints
- Run tests:

```bash
npm run test
```

---

### 9. Assumptions

- Audio download is mocked for demo purposes
- Azure integration is mocked if no key provided
- Only transcription and metadata are stored (no audio file upload)
- Pagination defaults: `page=1`, `limit=10`

---

### Loaded Production Build Angular UI (additional)

- Node API is configured to serve the Angular build as static files from the public/ folder.
- The Angular app can be accessed via http://<server>:<port>/.
- API routes remain fully functional alongside the Angular frontend.
---

### 11. Deployment(additional)

- GitHub workflow pipeline added to automatically deploy the app to any cloud server. You need to provide the cloud path and cloud credentials in the workflow to enable deployment.
---


