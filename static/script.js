document.getElementById("startBtn").addEventListener("click", async () => {
  document.getElementById("status").innerText = "Test running...";

  const res = await fetch("/speedtest");
  const data = await res.json();

  if (data.error) {
    document.getElementById("status").innerText = "Error: " + data.error;
  } else {
    document.getElementById("status").innerText = "✅ Test complete!";
    document.getElementById("download").innerText = data.download + " Mbps";
    document.getElementById("upload").innerText = data.upload + " Mbps";
    document.getElementById("ping").innerText = data.ping + " ms";
    document.getElementById("server").innerText = data.server;

    // Save to recent results table
    const row = `<tr>
      <td>${new Date().toLocaleString()}</td>
      <td>${data.download}</td>
      <td>${data.upload}</td>
      <td>${data.ping}</td>
      <td>${data.server}</td>
    </tr>`;
    document.getElementById("results").insertAdjacentHTML("afterbegin", row);
  }
});
