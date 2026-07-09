from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()  # load .env file

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

db = client["injury_detection_db"]

analysis_collection = db["pose_analysis_results"]
users_collection = db["users"]

def save_analysis_result(result):
    result["timestamp"] = datetime.utcnow()
    analysis_collection.insert_one(result)

