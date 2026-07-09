
import os
from django.conf import settings
from .utils.config import BODY_PART_MAP
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.http import JsonResponse, HttpResponse
from datetime import datetime
from pymongo import MongoClient
from .models import AnalysisRecord
from .utils.pose_estimator import analyze_video
from .utils.db import analysis_collection
from django.db.models import Avg
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AnalysisRecord
import random
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def avg_form_score(request):

    avg_score = AnalysisRecord.objects.filter(
        user=request.user
    ).aggregate(Avg("accuracy_score"))

    return Response({
        "avg_form_score": int(avg_score["accuracy_score__avg"] or 0)
    })

QUOTES = [
    {"quote": "Train smart. Stay injury free.", "author": "AI Injury Detection"},
    {"quote": "Your only limit is your mind.", "author": "Unknown"},
    {"quote": "Consistency builds strength.", "author": "Fitness Pro"},
    {"quote": "Form over speed. Always.", "author": "Coach Advice"},
    {"quote": "Small improvements every day lead to big results.", "author": "Unknown"},
    {"quote": "A strong body starts with correct posture.", "author": "AI Coach"},
    {"quote": "Discipline beats motivation when motivation fades.", "author": "Fitness Truth"},
    {"quote": "Train for longevity, not just intensity.", "author": "Sports Science"},
    {"quote": "Perfect reps prevent painful injuries.", "author": "AI Trainer"},
    {"quote": "Quality movement creates a powerful body.", "author": "Movement Coach"},
    {"quote": "Respect your body. It carries you through life.", "author": "Wellness"},
    {"quote": "Strength without control leads to injury.", "author": "Coach Insight"},
    {"quote": "Progress is impossible without proper form.", "author": "Training Rule"},
    {"quote": "Your health is your real wealth.", "author": "Unknown"},
    {"quote": "Train smarter today so you can train tomorrow.", "author": "AI Injury Detection"},
]
@api_view(['GET'])
def quote(request):
    return Response(random.choice(QUOTES))

@api_view(['GET'])
def api_home(request):
    return HttpResponse("Welcome to Injury Detection API")


# @api_view(['GET'])
# def exercises(request):
#     return JsonResponse({
#         "exercises": [
#             "Jumping Squats",
#             "Lunges",
#             "Pushups",
#             "Bridges",
#             "Leg Raises",
#             "Mountain Climbers"
#         ]

@api_view(["GET"])
def exercises(request):
    category = request.GET.get("category")

    # If category filter is used
    if category:
        if category in BODY_PART_MAP:
            return JsonResponse({
                "category": category,
                "exercises": BODY_PART_MAP[category]
            })
        else:
            return JsonResponse({
                "error": "Invalid category"
            }, status=400)

    # Default: return all categories
    return JsonResponse({
        "categories": BODY_PART_MAP
    })



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analysis_history(request):
    records = list(
        analysis_collection.find(
            {"user_id": request.user.id},
            {"_id": 0}
        ).sort("created_at", -1)
    )

    return Response({
        "count": len(records),
        "history": records
    })



# @csrf_exempt
# @api_view(['POST'])
# def analyze_video_api(request):
    # 1️⃣ Check video
    if "video" not in request.FILES:
        return Response(
            {"error": "No video uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 2️⃣ Check exercise
    exercise_name = request.POST.get("exercise")
    if not exercise_name:
        return Response(
            {"error": "Exercise not provided"},
            status=status.HTTP_400_BAD_REQUEST
        )

    print("Exercise received from frontend:", exercise_name)

    video_file = request.FILES["video"]

    # 🔽 Save video temporarily
    temp_dir = os.path.join(settings.BASE_DIR, "temp_videos")
    os.makedirs(temp_dir, exist_ok=True)

    video_path = os.path.join(temp_dir, video_file.name)

    with open(video_path, "wb+") as destination:
        for chunk in video_file.chunks():
            destination.write(chunk)

    # 🔽 Analyze
    result =analyze_video(video_path, exercise_name)
    print("Analysis result:", result)
    return JsonResponse(result)

    # 🔽 Save to MongoDB Atlas
    try:
        analysis_collection.insert_one({
            **result,
            "exercise": exercise_name,
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        print("MongoDB error:", e)

    return Response(result, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])  
def analyze_video_api(request):

    # 🔍 DEBUG (optional – remove later)
    print("USER:", request.user)
    print("USER ID:", request.user.id)

    # 1️⃣ Check video
    if "video" not in request.FILES:
        return Response(
            {"error": "No video uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 2️⃣ Check exercise
    exercise_name = request.POST.get("exercise")
    if not exercise_name:
        return Response(
            {"error": "Exercise not provided"},
            status=status.HTTP_400_BAD_REQUEST
        )

    video_file = request.FILES["video"]

    # 3️⃣ Save video temporarily
    upload_dir = os.path.join(settings.MEDIA_ROOT, "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    video_path = os.path.join(upload_dir, video_file.name)
    with open(video_path, "wb+") as destination:
        for chunk in video_file.chunks():
            destination.write(chunk)
    original_video_url = (settings.MEDIA_URL + 
                          "uploads/" + 
                          video_file.name)

    # 4️⃣ Analyze video
    result =analyze_video(video_path, exercise_name)
    result["original_video"] = original_video_url
    print("Analysis result:", result)
    return JsonResponse(result)

    # print("=============Result=============")
    # print(result)
    # Save analysis result to database

    if result.get("status") != "analysis_complete":
        return Response(
            result, status=200
        )
        
    AnalysisRecord.objects.create(
        user=request.user,
        exercise=exercise_name,
        risk_percent=result["risk_percent"],
        accuracy_score=result["accuracy_score"],
        fault=result["fault"]
        )

    # 5️⃣ SAVE TO MONGODB (ONLY VALID ANALYSIS)
    if result.get("status") == "analysis_complete":
        try:
            analysis_collection.insert_one({
                "user_id": request.user.id,          # ✅ IMPORTANT
                "exercise": exercise_name,
                "risk_percent": result.get("risk_percent", 0),
                "accuracy_score": result.get("accuracy_score", 0),
                "fault": result.get("fault", ""),
                "created_at": datetime.utcnow()
            })
        except Exception as e:
            print("MongoDB error:", e)

    # 6️⃣ Return response to frontend
    return Response(result, status=status.HTTP_200_OK)