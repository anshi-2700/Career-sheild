import os
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline

MODEL_FILE = os.path.join(os.path.dirname(__file__), "fake_job_model.pkl")

# Representative training corpus of Genuine vs Fake recruitment postings
TRAINING_DATA = [
    # Genuine Jobs (Label 0)
    ("We are looking for a Senior Software Engineer with 3+ years experience in Python, Django, PostgreSQL, and AWS. Full-time position with health benefits, 401k, competitive market salary.", 0),
    ("Frontend Developer required. Strong skills in React, TypeScript, and modern CSS frameworks. Collaborative team, agile sprint workflow, remote work options.", 0),
    ("Data Analyst position at Tech Corp. Requires proficiency in SQL, Python pandas, and Power BI dashboards. Bachelor's degree in Computer Science or Statistics required.", 0),
    ("Backend Engineer wanted. Experience with Microservices, Docker, Kubernetes, and REST API design. Standard 9-to-5 corporate environment.", 0),
    ("Full Stack Engineer needed. Node.js, React, MongoDB experience required. Send official CV to careers@techcorp.com", 0),
    ("Junior QA Engineer. Knowledge of manual testing, Selenium, and Python. Full-time on-site position at Bangalore office.", 0),
    
    # Fake / Scam Jobs (Label 1)
    ("URGENT HIRING! Earn $500 per day working from home! No experience required! Pay registration fee of $50 via GPay or Crypto to secure your interview kit immediately. Contact on Telegram @job_admin_quick", 1),
    ("Work from home data entry job! Instant job offer without interview! Send $30 processing fee for laptop dispatch. Telegram interview only.", 1),
    ("Congratulations! You are selected for Online Assistant role. Daily payment $200. Kindly pay small security deposit of 1000 INR to start training. Contact WhatsApp +919999999999", 1),
    ("Urgent requirement! High salary $10000/month. No interview needed. Wire transfer registration fee to unlock account. Email hr_cheap_scam@gmail.com", 1),
    ("Part-time online job guaranteed income. Earn 50,000 INR monthly by reviewing videos. Registration fee required upfront via USDT crypto.", 1),
    ("Immediate appointment letter issued! Telegram interview scheduled. Pay $100 badge fee before joining.", 1)
]

def train_and_save_model():
    texts, labels = zip(*TRAINING_DATA)
    
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ('clf', RandomForestClassifier(n_estimators=50, random_state=42))
    ])

    pipeline.fit(texts, labels)

    with open(MODEL_FILE, "wb") as f:
        pickle.dump(pipeline, f)

    print(f"Fake Job ML Model trained and saved to {MODEL_FILE}")
    return pipeline

def get_model():
    if os.path.exists(MODEL_FILE):
        try:
            with open(MODEL_FILE, "rb") as f:
                return pickle.load(f)
        except Exception:
            return train_and_save_model()
    else:
        return train_and_save_model()

if __name__ == "__main__":
    train_and_save_model()
