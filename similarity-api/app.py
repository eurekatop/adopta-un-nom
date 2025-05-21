from flask import Flask, request, jsonify
from spacy.vectors import Vectors
import spacy

app = Flask(__name__)
nlp = spacy.load("es_core_news_md")

@app.route("/similarity", methods=["GET"])
def similarity():
    word1 = request.args.get("word1")
    word2 = request.args.get("word2")

    if not word1 or not word2:
        return jsonify({"error": "word1 and word2 are required"}), 400

    token1 = nlp(word1)[0]
    token2 = nlp(word2)[0]
    similarity_score = token1.similarity(token2)

    return jsonify({
        "word1": word1,
        "word2": word2,
        "similarity": similarity_score
    })


@app.route("/most_similar", methods=["GET"])
def most_similar():
    word = request.args.get("word")
    candidates = request.args.get("candidates")

    if not word or not candidates:
        return jsonify({"error": "word and candidates are required"}), 400

    token_ref = nlp(word)[0]
    candidate_words = [w.strip() for w in candidates.split(",")]

    results = []
    for candidate in candidate_words:
        token = nlp(candidate)[0]
        score = token_ref.similarity(token)
        results.append((candidate, score))

    results.sort(key=lambda x: -x[1])  # Ordena de més similar a menys

    return jsonify({
        "word": word,
        "results": [
            {"candidate": w, "similarity": float(score)}
            for w, score in results
        ]
    })


@app.route("/most_similar_bulk", methods=["POST"])
def most_similar_bulk():
    data = request.get_json()
    word = data.get("word")
    candidates = data.get("candidates")

    if not word or not candidates or not isinstance(candidates, list):
        return jsonify({"error": "JSON must include 'word' and 'candidates' as a list."}), 400

    token_ref = nlp(word)[0]

    results = []
    for candidate in candidates:
        token = nlp(candidate)[0]
        score = token_ref.similarity(token)
        results.append((candidate, score))

    results.sort(key=lambda x: -x[1])

    return jsonify({
        "word": word,
        "results": [
            {"candidate": w, "similarity": float(score)}
            for w, score in results
        ]
    })


@app.route("/test", methods=["GET"])
def test():
    word = request.args.get("word")
    candidates = request.args.get("total")

    # Paraula d'interès
    paraula = "gato"

    # Obtenir el vector de la paraula
    doc = nlp(paraula)

    # Obtenir les 10 paraules més properes directament (si el model ho permet)
    vectors = nlp.vocab.vectors
    most_similar = vectors.most_similar(doc[0].vector.reshape(1, -1), n=50)
    for word in most_similar[0][0]:
        print(nlp.vocab.strings[word])


@app.route("/get_top_candidates", methods=["GET"])
def get_top_candidates():
    word = request.args.get("word")
    total = int(request.args.get("total", 10))  # per defecte 10

    doc = nlp(word)
    if not doc[0].has_vector:
        return jsonify({"error": f"La paraula '{word}' no té vector en el model."}), 404

    query_vector = doc[0].vector.reshape(1, -1)

    vectors = nlp.vocab.vectors
    if vectors is None or vectors.data.size == 0:
        return jsonify({"error": "El model no conté vectors entrenats."}), 500

    try:
        most_similar = vectors.most_similar(query_vector, n=total)
        keys = most_similar[0].ravel()
        scores = most_similar[1].ravel()
    except Exception as e:
        return jsonify({"error": f"Error trobant similars: {str(e)}"}), 500

    results = []
    for key, score in zip(keys, scores):
        try:
            similar_word = nlp.vocab.strings[int(key)]
            results.append({"candidate": similar_word, "similarity": float(score)})
        except Exception:
            continue  # ignora errors puntuals

    return jsonify({
        "word": word,
        "results": results
    })




@app.route("/test2", methods=["GET"])
def test2():
    # Paraula d'interès
    paraula = "gato"

    # Obtenir el vector de la paraula
    doc = nlp(paraula)
    if not doc[0].has_vector:
        print("La paraula no té vector en el model.")
    else:
        # Cerca les 10 paraules més similars en el vocabulari
        vocab = nlp.vocab
        similars = []
        
        # Compara amb totes les paraules del vocabulari (pot ser lent)
        # NOTA: En la pràctica, és millor limitar la cerca a paraules freqüents.
        for word in vocab:
            if word.is_lower and word.has_vector and word.is_alpha and word.text != paraula:
                similars.append((word.text, word.similarity(doc[0])))
        
        # Ordena per similitud i selecciona les 10 millors
        similars = sorted(similars, key=lambda x: -x[1])[:10]
        
        print(f"Paraules similars a '{paraula}':")
        for word, sim in similars:
            print(f"{word}: {sim:.3f}")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
