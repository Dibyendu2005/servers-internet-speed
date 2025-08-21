from flask import Flask, render_template, jsonify
import speedtest
import threading
import time

app = Flask(__name__)

# Store results in memory
results_history = []

def run_speed_test():
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        download_speed = round(st.download() / 1_000_000, 2)  # Mbps
        upload_speed = round(st.upload() / 1_000_000, 2)      # Mbps
        ping = round(st.results.ping, 2)
        server = st.get_best_server()["host"]

        result = {
            "date": time.strftime("%Y-%m-%d %H:%M:%S"),
            "download": download_speed,
            "upload": upload_speed,
            "ping": ping,
            "server": server
        }

        results_history.insert(0, result)  # latest first
        if len(results_history) > 10:
            results_history.pop()  # keep only last 10

        return result
    except Exception as e:
        return {"error": str(e)}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start-test")
def start_test():
    result = run_speed_test()
    return jsonify(result)

@app.route("/history")
def history():
    return jsonify(results_history)

if __name__ == "__main__":
    app.run(debug=True)
