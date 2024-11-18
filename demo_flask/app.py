import joblib
import os
import re

from flask import Flask, request, jsonify
from konlpy.tag import Okt

app = Flask(__name__)
app.debug = False

okt = Okt()
# Flask는 전역변수를 허용하기로 함 (웹서버는 전역변수 사용 불가)
tfidf_vector = None
model_lr = None

def tw_tokenizer(text):
    tokenzier_ko = okt.morphs(text)
    return tokenzier_ko


# 선언한 전역 변수 사용, app.run() 보다 먼저 호출되어야 함
def load_lr():
    global tfidf_vector, model_lr
    tfidf_vector = joblib.load(os.path.join(app.root_path, "model/tfidf_vect.pkl"))
    model_lr = joblib.load(os.path.join(app.root_path, "model/lr.pkl"))


def lt_transform(review):
    review = re.sub(r"\d+", " ", review)
    tfidf_matrix = tfidf_vector.transform([review])
    return tfidf_matrix

# CORS 설정
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')  # 모든 출처 허용
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')  # 허용할 HTTP 메서드
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')  # 허용할 헤더
    return response

@app.route("/predict", methods=["POST"])
def nlp_predict():
    review = request.json["review"]  # 요청값 받기
    if len(review) > 501:
        return jsonify(None)
    review_matrix = lt_transform(review)
    review_result = model_lr.predict(review_matrix)[0]
    predict_result = ("긍정" if review_result else "부정")  # 1인경우 긍정 / 0인경우 부정
    result = {"review": review, "review_result": predict_result}
    return jsonify(result)

if __name__ == "__main__":
    load_lr()
    app.run('0.0.0.0',"5000")
