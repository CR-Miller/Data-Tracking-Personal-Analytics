# Milestone 4 Testing Summary

## Project Name
Data Tracking Personal Analytics / StudySync

## Purpose
This milestone verifies the reliability, usability, performance, accessibility, and ethical data handling of the application before final presentation and deployment.

## Automated Testing Summary

### Backend Testing
The backend was tested using Spring Boot, JUnit, and API requests.

Planned backend tests:
1. GET `/api/tasks` returns a successful response.
2. POST `/api/tasks` creates a new task.
3. DELETE `/api/tasks/{id}` removes a task.
4. PUT `/api/tasks/{id}` updates a task due date.

Backend CRUD functionality was also manually verified using curl and Postman.

### Frontend Testing
The frontend was tested using React/Vite.

Planned frontend tests:
1. Tasks page loads successfully.
2. Add Task form displays correctly.
3. User can create a task.
4. Delete button appears for each task.

## Manual Test Results

| Feature | Test | Result |
|---|---|---|
| Create Task | Added task through frontend | Pass |
| Read Tasks | Tasks displayed from backend | Pass |
| Update Task | Changed due date | Pass |
| Delete Task | Deleted task by ID | Pass |
| API Connection | Frontend connected to Spring Boot backend | Pass |

## Performance & Usability

### Response Time
API response time was checked using Postman and curl.

| Endpoint | Result |
|---|---|
| GET `/api/tasks` | Fast response |
| POST `/api/tasks` | Task created successfully |
| PUT `/api/tasks/{id}` | Task updated successfully |
| DELETE `/api/tasks/{id}` | Task removed successfully |

### Usability Testing
The app was reviewed for basic usability.

Observed improvements:
1. Simplified navigation so users can quickly switch between Tasks and Add Task.
2. Added due date input so users can control task deadlines.
3. Added delete functionality so users can remove unnecessary tasks.

## Accessibility Checklist

| Check | Status |
|---|---|
| Text is readable | Complete |
| Buttons are clearly labeled | Complete |
| Form inputs have placeholders | Complete |
| Color contrast reviewed | Complete |
| No unnecessary images without alt text | Complete |

## Ethics & Data Handling

The application stores basic task information such as title, description, due date, and status. It does not intentionally collect sensitive personal data.

Ethical considerations:
- User data should only be used for task tracking.
- Passwords should not be stored in plain text in a production system.
- Authentication should be improved before deployment.
- AI assistance was used for debugging, code structure, and documentation support.

## Conclusion
Testing helped confirm that the application supports core CRUD operations and that the frontend and backend communicate correctly. The project is ready for final polishing, screenshots, and submission.