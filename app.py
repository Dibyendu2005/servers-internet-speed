from flask import Flask, render_template, jsonify
import speedtest

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/speedtest")
def run_speedtest():
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        download_speed = st.download() / 1_000_000  # Mbps
        upload_speed = st.upload() / 1_000_000      # Mbps
        ping = st.results.ping
        server = st.get_best_server().get('host', 'Unknown')

        return jsonify({
            "download": round(download_speed, 2),
            "upload": round(upload_speed, 2),
            "ping": round(ping, 2),
            "server": server
        })
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
