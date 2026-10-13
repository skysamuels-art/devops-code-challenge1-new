pipeline {
    agent any

    environment {
        AWS_REGION = 'us-west-1'

        ECR_REGISTRY = '060255765406.dkr.ecr.us-west-1.amazonaws.com'

        FRONTEND_REPO = '060255765406.dkr.ecr.us-west-1.amazonaws.com/devops-challenge-frontend'
        BACKEND_REPO = '060255765406.dkr.ecr.us-west-1.amazonaws.com/devops-challenge-backend'

        // Replace these three values with your actual ECS names.
        ECS_CLUSTER = 'devops-challenge-cluster'
        FRONTEND_SERVICE = 'devops-challenge-frontend-service'
        BACKEND_SERVICE = 'devops-challenge-backend-service'
    }

    stages {
        stage('Checkout code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker images') {
            steps {
                sh 'docker build -t frontend:latest ./frontend'
                sh 'docker build -t backend:latest ./backend'
            }
        }

        stage('Authenticate to ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'Jenkins Integration2'
                ]]) {
                    sh '''
                        aws --version
                        aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"
                    '''
                }
            }
        }

        stage('Tag and Push images to ECR') {
            steps {
                sh '''
                    docker tag frontend:latest "$FRONTEND_REPO:latest"
                    docker tag backend:latest "$BACKEND_REPO:latest"

                    docker push "$FRONTEND_REPO:latest"
                    docker push "$BACKEND_REPO:latest"
                '''
            }
        }

        stage('Update ECS services') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'Jenkins Integration2'
                ]]) {
                    sh '''
                        aws ecs update-service --cluster "$ECS_CLUSTER" --service "$FRONTEND_SERVICE" --force-new-deployment --region "$AWS_REGION"
                        aws ecs update-service --cluster "$ECS_CLUSTER" --service "$BACKEND_SERVICE" --force-new-deployment --region "$AWS_REGION"
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
