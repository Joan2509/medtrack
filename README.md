# MedTrack
This is a basic health information system designed to manage clients and health programs/services.The system allows a doctor to create health programs, register clients, enroll clients in programs, search for clients, view client profiles, and expose client profiles via an API.

## Innovations and Optimizations
**Modal Popup for Profiles:** Client profiles are displayed in a centered modal popup, improving UX by overlaying the main content without disrupting the workflow.

**Program Selection During Registration:** Added a multi-select dropdown to enroll clients in programs directly during registration, streamlining the process.

**Persistent Login**: Utilizes localStorage to maintain login state across page refreshes, enhancing usability.

**Sticky Sidebar:** The "Create Program" form is a sticky left sidebar, keeping it accessible while scrolling through the client registration form.

**Audit Logging:** Backend logs actions (e.g., program creation, client registration) to an audit_logs table for traceability.

**API-First Approach** The system adopts an API-first approach, with the backend exposing RESTful endpoints to handle all core functionalities. The frontend communicates exclusively via these APIs, ensuring modularity and potential for integration with other systems.

## Project Structure

``` bash
medtrack/
frontend/
├── index.html
├── styles.css
├── js/
│   ├── script.js
│   ├── auth.js
│   ├── program.js
│   ├── client.js
│   ├── ui.js
│   ├── profile.js
backend/
├── routes/
│   ├── api.js           # Express routes for API endpoints
├── db.js                # SQLite database setup and schema
├── server.js            # Express server configuration
├── package.json         # Node.js dependencies and scripts
├── README.md            # Project documentation
└── health.db            # SQLite database file (generated on startup)
```
## Prerequisites
- Node.js
- npm: Included with Node.js
- Git: For cloning the repository
- SQLite: No separate installation needed (uses sqlite3 npm package)

## Error Handling
Frontend displays user-friendly messages (e.g., “Name is required”).

Backend returns appropriate HTTP status codes (400, 401, 404, 500).

## Setup and Running the Project

1. Clone the Repository:
``` bash
git clone <https://github.com/Joan2509/medtrack>
cd medtrack
```
2. Install Dependancies
``` bash
npm install
```
This installs express, sqlite3, and other dependencies listed in package.json.

3. Start the Server:
``` bash
npm start
```
This runs node server.js, starting the Express server on http://localhost:3000.

4. Access the Application:
Open http://localhost:3000 in a web browser.

5. Log in with the password 123 (case-sensitive).

**Stop the Server:** Press Ctrl+C in the terminal to stop the server.

## Testing the Application

1. Login: Use password 123 to access the system.

2. Create Program: Enter a program name (e.g., “TB”) and description, click “Create”.

3. Register Client: Fill in name, date of birth, optional gender/contact, select programs from the dropdown, and click “Register”.

4. Search Client: Enter a name or contact in the navbar search, press Enter, and click a result to view the profile modal.


## API Testing:
``` bash
curl -H "Authorization: Bearer 123" http://localhost:3000/api/clients/1
```
Replace 1 with a valid client ID to test the profile API.

## Licence
MIT

## Author
[Joan Wambugu](https://github.com/Joan2509/)
