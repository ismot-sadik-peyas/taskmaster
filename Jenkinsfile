pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        IMAGE_NAME = "taskmaster-api"
    }

    stages {

        /* 1. BUILD */
        stage('Build') {
            steps {
                echo "Installing dependencies..."
                dir('backend') {
                    bat 'npm install'
                    bat 'npm run build'
                }

                echo "Building Docker image..."
                bat 'docker build -t %IMAGE_NAME%:test .'
            }
        }

        /* 2. TEST */
        stage('Test') {
            steps {
                echo "Running Jest tests..."
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        /* 3. CODE QUALITY (SONARQUBE) */
        stage('Code Quality - SonarQube') {
            steps {
                echo "Running SonarQube analysis..."

                bat '''
                curl -L -o sonar.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-windows.zip
                powershell -Command "Expand-Archive sonar.zip -DestinationPath . -Force"
                sonar-scanner-5.0.1.3006-windows\\bin\\sonar-scanner.bat ^
                  -Dsonar.login=%SONAR_TOKEN% ^
                  -Dsonar.projectKey=taskmaster ^
                  -Dsonar.sources=backend/src ^
                  -Dsonar.host.url=http://localhost:9000
                '''
            }
        }

        /* 4. SECURITY */
        stage('Security Scan') {
            steps {
                echo "Running npm audit..."
                dir('backend') {
                    bat 'npm audit --audit-level=moderate || exit 0'
                }
            }
        }

        /* 5. DEPLOY TO TEST */
        stage('Deploy to Test') {
            steps {
                echo "Deploying test container..."
                bat 'docker rm -f taskmaster-test || exit 0'
                bat 'docker run -d --name taskmaster-test -p 3001:3000 %IMAGE_NAME%:test'
            }
        }

        /* 6. RELEASE TO PRODUCTION */
        stage('Release to Production') {
            when {
                branch 'main'
            }
            steps {
                echo "Promoting image to production..."
                bat 'docker rm -f taskmaster-prod || exit 0'
                bat 'docker tag %IMAGE_NAME%:test %IMAGE_NAME%:prod'
                bat 'docker run -d --name taskmaster-prod -p 3000:3000 %IMAGE_NAME%:prod'
            }
        }

        /* 7. MONITORING */
        stage('Monitoring') {
            steps {
                echo "Checking application health..."
                bat 'curl -f http://localhost:3000/health'

                echo "Checking Prometheus-style metrics..."
                bat 'curl -f http://localhost:3000/metrics'
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed — check logs!"
        }
    }
}
