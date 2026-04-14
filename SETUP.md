# Aegis SLM Forge - Local Setup Guide

This guide provides instructions on how to set up and run the Aegis SLM Forge environment on your local machine using VS Code.

## Prerequisites

1.  **Node.js**: Install Node.js (v18 or higher) from [nodejs.org](https://nodejs.org/).
2.  **VS Code**: Install Visual Studio Code from [code.visualstudio.com](https://code.visualstudio.com/).
3.  **Git**: Install Git from [git-scm.com](https://git-scm.com/).

## Installation Steps

1.  **Clone the Repository**:
    Open your terminal and run:
    ```bash
    git clone <your-repo-url>
    cd aegis-slm-forge
    ```

2.  **Install Dependencies**:
    Run the following command to install all required npm packages:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    *   Copy the `.env.example` file to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file in VS Code and add your **GEMINI_API_KEY**. You can get one from the [Google AI Studio](https://aistudio.google.com/).

4.  **Run the Development Server**:
    Start the Vite development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Structure

- `src/components/`: UI modules for Local Mode, Cloud Core, and Media Lab.
- `src/services/`: Integration logic for Gemini API (Text, Image, Video, Music).
- `src/lib/`: Utility functions and shared logic.
- `metadata.json`: Application metadata and permissions.

## Advanced Integrations

Aegis is pre-configured to support:
- **Composio**: For 250+ tool integrations.
- **Browser Use**: For autonomous web navigation.
- **LangSmith**: For agent observability and tracing.

To enable these, add the respective API keys to your `.env` file.

## Troubleshooting

- **Port Conflict**: If port 3000 is in use, Vite will automatically try the next available port. Check the terminal output for the correct URL.
- **API Errors**: Ensure your Gemini API key is valid and has sufficient quota for Video/Music generation models.
