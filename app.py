from flask import Flask, render_template, jsonify
import speedtest

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")  # your frontend in templates/index.html

@app.route("/speedtest")
def run_speedtest():
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        download_speed = st.download() / 1_000_000  # Convert to Mbps
        upload_speed = st.upload() / 1_000_000      # Convert to Mbps
        ping_result = st.results.ping

        return jsonify({
            "download": round(download_speed, 2),
            "upload": round(upload_speed, 2),
            "ping": round(ping_result, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
