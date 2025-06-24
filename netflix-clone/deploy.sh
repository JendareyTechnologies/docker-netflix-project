#!/bin/bash

# Netflix Clone Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Docker
install_docker() {
    print_status "Installing Docker..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command_exists apt-get; then
            # Ubuntu/Debian
            sudo apt-get update
            sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io
        elif command_exists yum; then
            # CentOS/RHEL
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io
        else
            print_error "Unsupported Linux distribution"
            exit 1
        fi
        
        # Start and enable Docker
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
        
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        print_warning "Please install Docker Desktop for Mac from https://docs.docker.com/desktop/mac/install/"
        exit 1
    else
        print_error "Unsupported operating system"
        exit 1
    fi
}

# Function to install Docker Compose
install_docker_compose() {
    print_status "Installing Docker Compose..."
    
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command_exists docker; then
        print_warning "Docker not found. Installing Docker..."
        install_docker
        print_success "Docker installed successfully"
        print_warning "Please logout and login again, then run this script again"
        exit 0
    else
        print_success "Docker is installed"
    fi
    
    # Check if Docker Compose is installed
    if ! command_exists docker-compose; then
        print_warning "Docker Compose not found. Installing Docker Compose..."
        install_docker_compose
        print_success "Docker Compose installed successfully"
    else
        print_success "Docker Compose is installed"
    fi
    
    # Check if Docker daemon is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker and try again."
        exit 1
    fi
    
    print_success "All prerequisites met"
}

# Function to deploy the application
deploy_app() {
    print_status "Deploying Netflix Clone..."
    
    # Stop existing containers
    if docker-compose ps | grep -q netflix-clone; then
        print_status "Stopping existing containers..."
        docker-compose down
    fi
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose up -d --build
    
    # Wait for container to be ready
    print_status "Waiting for application to be ready..."
    sleep 10
    
    # Check if container is running
    if docker-compose ps | grep -q "Up"; then
        print_success "Container is running"
    else
        print_error "Failed to start container"
        docker-compose logs
        exit 1
    fi
    
    # Test the application
    print_status "Testing application..."
    if curl -f http://localhost > /dev/null 2>&1; then
        print_success "Application is responding"
    else
        print_warning "Application might not be ready yet. Check logs with: docker-compose logs"
    fi
}

# Function to display final information
show_completion_info() {
    print_success "Netflix Clone deployed successfully!"
    echo
    echo "🎉 Your Netflix Clone is now running!"
    echo
    echo "📍 Access your application:"
    echo "   Local: http://localhost"
    echo "   Server: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
    echo
    echo "🔧 Useful commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop app: docker-compose down"
    echo "   Restart: docker-compose restart"
    echo "   Update: git pull && docker-compose up -d --build"
    echo
    echo "📚 For more information, check DEPLOYMENT_GUIDE.md"
}

# Main execution
main() {
    echo "🎬 Netflix Clone Deployment Script"
    echo "================================="
    echo
    
    # Check if we're in the right directory
    if [[ ! -f "docker-compose.yml" ]]; then
        print_error "docker-compose.yml not found. Please run this script from the Netflix clone directory."
        exit 1
    fi
    
    check_prerequisites
    deploy_app
    show_completion_info
}

# Run main function
main "$@"