# TaskMaster – DevOps CI/CD Pipeline Project (SIT753)

**TaskMaster** is a full-stack task management application featuring an automated **7-stage Jenkins CI/CD pipeline**. This project was developed to meet the High Distinction requirements for SIT753.

## Features

### Backend
- **REST API**: Built with Node.js and Express.
- **Authentication**: JWT-based secure user login.
- **Data Management**: In-memory data storage with a clean model layer.
- **Observability**: Health check (`/health`) and Prometheus metrics (`/metrics`) endpoints using `prom-client`.
- **Testing**: Robust unit testing suite using Jest.

### Frontend
- **Single Page App**: Modern, responsive dashboard using vanilla HTML, CSS, and JavaScript.
- **Task Management**: Full CRUD operations (create, read, update, delete) with priority levels and due dates.
- **API Explorer**: Built-in testing tool to interact with backend endpoints.

### DevOps & CI/CD
### DevOps & CI/CD
- Fully automated Jenkins pipeline (7 stages)
- Docker containerization
- SonarCloud code quality analysis
- Security scanning
- Test & Production environment deployment
- Monitoring & health validation


##  Tech Stack


| Layer 				|		 Technology 		|
| --- --- ---			| --- --- --- --- --- --- 	|
| **Backend** 			| Node.js, Express 			|
| **Frontend** 			| HTML5, CSS3, JavaScript 	|
| **Authentication**	|     JWT 					|
| **Testing** 			|      Jest				 	|
| **Containerization** 	| Docker 					|
| **CI/CD**				| Jenkins 					|
| **Code Quality**	 	| SonarCloud 				|
| **Monitoring** 	 	|prom-client (``/metrics``)	|

--- --- --- --- --- --- --- --- --- --- --- --- --- -

## Project Structure

```bash
taskmaster/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── __tests__/        # Jest test suites
│   ├── package.json
│   └── sonar-project.properties
├── frontend/
│   └── public/
│       └── index.html        # Single-page dashboard UI
├── Dockerfile
├── Jenkinsfile
├── README.md
└── .gitignore
```

---

##  Jenkins Pipeline Stages

1. **Build** — Install dependencies and compile the Docker image.
2. **Test** — Execute Jest unit tests and generate coverage reports.
3. **Code Quality** — Pass source code to SonarCloud for static analysis.
4. **Security** — Run `npm audit` to scan for dependency vulnerabilities.
5. **Deploy to Test** — Spin up a staging container accessible on port `4001`.
6. **Release to Production** — Deploy the stable container live on port `4000`.
7. **Monitoring** — Run automated checks against `/health` and `/metrics`.

---

## 🧪 Quick Start

### Using Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/ismot-sadik-peyas/taskmaster.git
cd taskmaster

# Build the image
docker build -t taskmaster-api .

# Run the container (Production port)
docker run -d -p 4000:3000 taskmaster-api
```
The application will be available locally at: **`http://localhost:4000`**

### Local Development
```bash
# Set up backend
cd backend
npm install
npm start
```
Once the backend server starts, open **`frontend/public/index.html`** directly in any modern web browser.

---

## 📊 SonarCloud Quality Gate
* **Project Key**: `ismot-sadik-peyas_taskmaster`
* **Monitored Metrics**: Code Reliability, Security Hotspots, Technical Debt, and Test Coverage.
