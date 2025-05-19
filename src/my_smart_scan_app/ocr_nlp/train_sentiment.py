# train_sentiment.py
from sklearn.datasets import fetch_20newsgroups
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
import joblib
import numpy as np

# نبني مجموعة بيانات ثنائية (positive/negative) مبسَّطة
cats = ["rec.autos", "sci.space"]   # autos = negative, space = positive (كمثال)
data = fetch_20newsgroups(subset="train", categories=cats,
                          remove=("headers", "footers", "quotes"))
X_train, X_val, y_train, y_val = train_test_split(
    data.data, np.array(data.target), test_size=0.2, random_state=42)

model = Pipeline([
    ("tfidf", TfidfVectorizer(stop_words="english", max_features=5000)),
    ("clf", LogisticRegression(max_iter=1000))
])

model.fit(X_train, y_train)
print("val acc:", accuracy_score(y_val, model.predict(X_val)))

joblib.dump(model, "sentiment_model.joblib")
print("✅ Model saved as sentiment_model.joblib")