async function startSpeedTest() {
    let startBtn = document.getElementById("startBtn");
    let againBtn = document.getElementById("againBtn");
    let countdownElem = document.getElementById("countdown");

    startBtn.style.display = "none";
    againBtn.style.display = "none";

    let timeLeft = 60;
    countdownElem.textContent = `Test running... ${timeLeft}s`;

    let timer = setInterval(() => {
        timeLeft--;
        countdownElem.textContent = `Test running... ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
        }
    }, 1000);

    try {
        // Run backend test
        const response = await fetch("/start-test");
        const data = await response.json();

        clearInterval(timer);
        countdownElem.textContent = "✅ Test Finished";

        if (data.error) {
            countdownElem.textContent = "❌ Error: " + data.error;
            startBtn.style.display = "block";
            return;
        }

        // Update result
        document.getElementById("download").textContent = data.download;
        document.getElementById("upload").textContent = data.upload;
        document.getElementById("ping").textContent = data.ping;
        document.getElementById("server").textContent = data.server;

        // Reload history
        loadHistory();

        // Show "Test Again" button
        againBtn.style.display = "inline-block";

    } catch (err) {
        clearInterval(timer);
        countdownElem.textContent = "❌ Failed to fetch test results.";
        startBtn.style.display = "block";
    }
}

document.getElementById("startBtn").addEventListener("click", startSpeedTest);
document.getElementById("againBtn").addEventListener("click", startSpeedTest);

async function loadHistory() {
    const response = await fetch("/history");
    const history = await response.json();
    let table = document.getElementById("resultsTable");
    table.innerHTML = "";

    history.forEach(row => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.date}</td>
          <td>${row.download}</td>
          <td>${row.upload}</td>
          <td>${row.ping}</td>
          <td>${row.server}</td>
        `;
        table.appendChild(tr);
    });
}

// Load history when page loads
window.onload = loadHistory;
