# Chrome Extension Summarizer

This project is a Chrome extension that summarizes webpage content using the Ollama language model.

## Features

- Extracts and summarizes text from any webpage.
- Uses a Flask backend to communicate with the Ollama API.
- Provides a simple and user-friendly interface.

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/yourusername/chrome-extension-summarizer.git
   ```
2. Navigate to the project directory:
   ```sh
   cd chrome-extension-summarizer
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

## Running the Server

Start the Flask server to process text summarization:

```sh
python server.py
```

## Installing the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer Mode** (toggle in the top right corner).
3. Click **Load unpacked** and select the `extension` folder from this project.

## Usage

- Click the extension icon in Chrome.
- Press the **Summarize** button to generate a summary.
- If the API server is down, restart `server.py`.

## API Endpoint

The Flask backend provides a `/summarize` endpoint.

- **URL:** `http://127.0.0.1:5001/summarize`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "text": "The quick brown fox jumps over the lazy dog."
  }
  ```

- **Response:**

  ```json
  {
    "summary": "This is a famous pangram, using all letters of the alphabet."
  }
  ```

