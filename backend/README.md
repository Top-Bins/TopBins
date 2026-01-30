# TopBins Backend

This is the FastAPI backend for the TopBins application.

## Prerequisites

- Python 3.10+
- pip

## Setup

1.  **Create a virtual environment:**

    ```bash
    python -m venv venv
    ```

2.  **Activate the virtual environment:**

    - **Windows (PowerShell):**
      ```powershell
      .\venv\Scripts\Activate
      ```
    - **Windows (Command Prompt):**
      ```cmd
      venv\Scripts\activate
      ```
    - **macOS/Linux:**
      ```bash
      source venv/bin/activate
      ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

## Running the Server

To start the development server with hot-reload enabled:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

- **API Documentation:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

## Running Tests

To run the test suite:

```bash
pytest
```
