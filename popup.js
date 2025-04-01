document.addEventListener("DOMContentLoaded", function () {
    const summarizeBtn = document.getElementById("summarizeBtn");
    const loading = document.getElementById("loading");
    const summaryContainer = document.getElementById("summary-container");
    const summaryEl = document.getElementById("summary");
    const copyBtn = document.getElementById("copyBtn");

    // Ensure elements are hidden when the extension loads
    loading.classList.add("hidden");
    summaryContainer.classList.add("hidden");
    copyBtn.classList.add("hidden");

    summarizeBtn.addEventListener("click", async () => {
        // Reset UI before summarization
        summaryEl.innerHTML = "";
        summaryContainer.classList.add("hidden");
        copyBtn.classList.add("hidden");
        loading.classList.remove("hidden"); // Show loading animation

        try {
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // Extract webpage text
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    function: extractText,
                },
                async (results) => {
                    if (results && results[0] && results[0].result) {
                        const text = results[0].result;

                        try {
                            const response = await fetch("http://localhost:5001/summarize", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ text: text })
                            });

                            const data = await response.json();
                            if (response.ok && data.summary) {
                                summaryEl.innerHTML = formatSummary(data.summary);
                                summaryContainer.classList.remove("hidden"); // Show summary
                                copyBtn.classList.remove("hidden"); // Show copy button
                            } else {
                                showError("❌ Error summarizing the content.");
                            }
                        } catch (error) {
                            showError("⚠ An error occurred. Check the API server.");
                            console.error(error);
                        } finally {
                            loading.classList.add("hidden"); // Hide loading animation
                        }
                    } else {
                        showError("⚠ Failed to retrieve the page text.");
                    }
                }
            );
        } catch (error) {
            showError("⚠ Failed to access the active tab.");
            console.error(error);
        }
    });

    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(summaryEl.innerText).then(() => {
            alert("✅ Summary copied to clipboard!");
        });
    });

    // Extracts up to 5000 characters of webpage text
    function extractText() {
        return document.body.innerText.slice(0, 5000);
    }

    // Function to format the summary text properly
    function formatSummary(summary) {
        summary = summary.replace(/\* (.+)/g, "<li>$1</li>");
        summary = summary.replace(/\n/g, "<br>");

        if (summary.includes("<li>")) {
            summary = summary.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");
        }

        return summary;
    }

    function showError(message) {
        summaryEl.textContent = message;
        summaryContainer.classList.remove("hidden");
        loading.classList.add("hidden");
    }
});
