from flask import Flask, request, jsonify
import fasttext

app = Flask(__name__)
model = fasttext.load_model("cc.es.300.bin")

@app.route("/neighbors", methods=["GET"])
def neighbors():
    word = request.args.get("word")
    topn = int(request.args.get("top", 10))

    if not word:
        return jsonify({"error": "word parameter is required"}), 400

    try:
        similar = model.get_nearest_neighbors(word, k=topn)
        results = [
            {"word": w, "similarity": float(score)} for score, w in similar
        ]
        return jsonify({"word": word, "neighbors": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
