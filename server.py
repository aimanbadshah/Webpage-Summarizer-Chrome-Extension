from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OLLAMA_API = "http://localhost:11434/api/generate"  # Adjust if needed
MAX_LENGTH = 500  # Limit input size

@app.route("/summarize", methods=["POST"])
def summarize():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415

    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Truncate long text
    if len(text) > MAX_LENGTH:
        text = text[:MAX_LENGTH] + "..."  # Indicate truncation

    payload = {
        "model": "llama3.2:1b",
        "prompt": f"Summarize this: {text}",
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API, json=payload, timeout=60)
        response.raise_for_status()  # Raise error for bad responses

        response_json = response.json()

        # Check if response has expected structure
        if "response" not in response_json:
            return jsonify({"error": "Unexpected API response"}), 500

        summary = response_json.get("response", "").strip()
        if not summary:
            return jsonify({"error": "No summary generated"}), 500

        return jsonify({"summary": summary})

    except requests.exceptions.Timeout:
        return jsonify({"error": "Ollama API timeout"}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Ollama request failed: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
