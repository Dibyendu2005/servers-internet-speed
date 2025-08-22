from flask import Flask, render_template, jsonify
import speedtest

app = Flask(__name__)

# Homepage route
@app.route("/")
def home():
    return render_template("index.html")   # Loads templates/index.html

# API route to run speed test
@app.route("/speedtest")
def run_speedtest():
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        download = round(st.download() / 1_000_000, 2)  # Mbps
        upload = round(st.upload() / 1_000_000, 2)      # Mbps
        ping = round(st.results.ping, 2)                # ms

        return jsonify({
            "download": download,
            "upload": upload,
            "ping": ping,
            "server": st.best.get("host", "Unknown")
        })
    except Exception as e:
        return jsonify({"error": str(e)})

# Run locally
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
