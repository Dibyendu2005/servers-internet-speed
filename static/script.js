document.getElementById("startBtn").addEventListener("click", async () => {
    let countdownElem = document.getElementById("countdown");
    let timeLeft = 60;
    countdownElem.textContent = `Test running... ${timeLeft}s`;

    let timer = setInterval(() => {
        timeLeft--;
        countdownElem.textContent = `Test running... ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
        }
    }, 1000);

    // Start test (backend takes time)
    const response = await fetch("/start-test");
    const data = await response.json();

    clearInterval(timer);
    countdownElem.textContent = "✅ Test Finished";

    if (data.error) {
        countdownElem.textContent = "❌ Error: " + data.error;
        return;
    }

    // Update result
    document.getElementById("download").textContent = data.download;
    document.getElementById("upload").textContent = data.upload;
    document.getElementById("ping").textContent = data.ping;
    document.getElementById("server").textContent = data.server;

    loadHistory();
});

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

// Load past history on page load
window.onload = loadHistory;
