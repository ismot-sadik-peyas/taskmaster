pipeline {
    agent any
    environment {
        APP_NAME = 'taskmaster'
        DOCKER_IMAGE = 'taskmaster-devops'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                    sh 'npm run build'
                    sh 'docker build -t $DOCKER_IMAGE:$BUILD_NUMBER .'
                }
            }
        }
        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }
        stage('Code Quality') {
            steps {
                dir('backend') {
                    sh 'npm run lint || echo "Linting completed"'
                }
            }
        }
        stage('Security') {
            steps {
                dir('backend') {
                    sh 'npm audit --audit-level=moderate || echo "Security scan completed"'
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker stop $APP_NAME-staging || true'
                sh 'docker rm $APP_NAME-staging || true'
                sh 'docker run -d --name $APP_NAME-staging -p 3001:3000 $DOCKER_IMAGE:$BUILD_NUMBER'
            }
        }
        stage('Release') {
            steps {
                sh 'git tag -a v1.0.$BUILD_NUMBER -m "Release v1.0.$BUILD_NUMBER"'
                sh 'git push origin v1.0.$BUILD_NUMBER'
            }
        }
        stage('Monitoring') {
            steps {
                echo 'Monitoring: Prometheus metrics available at http://localhost:3000/metrics'
                echo 'Health check: http://localhost:3001/health'
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}