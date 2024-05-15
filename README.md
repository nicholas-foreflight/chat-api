# Spring Boot Application

## Getting Started

### Prerequisites

1. **Amazon Corretto 17**
    - Download and install Amazon Corretto 17 from [Amazon Corretto 17](https://corretto.aws/downloads/).

### Configuration

1. **Environment Variable**
    - Set the environment variable `SPRING_AI_OPENAI_API_KEY` with your OpenAI API key.
      ```shell
      export SPRING_AI_OPENAI_API_KEY='your_openai_api_key_here'
      ```

### Running the Application

1. **Start the Application**
    - Use the following command to run the application:
      ```shell
      ./gradlew bootRun
      ```

### Accessing the Application

1. **Swagger UI**
    - Access the Swagger UI at [localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) for API documentation.

2. **UI Landing Page**
    - Visit the UI landing page at [localhost:8080/](http://localhost:8080/) to interact with the application.
