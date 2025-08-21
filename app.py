from flask import Flask, jsonify
from flask_cors import CORS
import speedtest

app = Flask(__name__)
CORS(app)

@app.route('/speedtest', methods=['POST'])
def run_speedtest():
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        download = st.download() / 1_000_000  # Mbps
        upload = st.upload() / 1_000_000      # Mbps
        ping = st.results.ping
        server = st.results.server['host']

        return jsonify({
            "download": round(download, 2),
            "upload": round(upload, 2),
            "ping": round(ping, 2),
            "server": server
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
