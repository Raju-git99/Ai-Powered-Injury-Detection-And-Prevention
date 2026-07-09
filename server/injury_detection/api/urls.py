# from django.urls import path
# from .views import analyze_video, exercises
# from django.http import JsonResponse
# from . import views
# from django.urls import path
# # from .views import mongo_test_view
# from .views import analysis_history


# # urlpatterns = [
# #     path("mongo-test/", mongo_test_view),
# # ]

# def api_home(request):
#     return JsonResponse({"message": "Welcome to Injury Detection API"})


# urlpatterns = [
#     path('', api_home, name='api_home'),  # 👈 root /api/ route
#     path('exercises/', exercises),
#     path('analyze/', analyze_video),
#     # path('test_mongo/', test_mongo),
#     # path("mongo-test/", mongo_test_view),
#     path('history/', analysis_history),

# ]



from django.urls import path
from .views import api_home, exercises, analyze_video_api, analysis_history, avg_form_score
from .views import quote


urlpatterns = [
    path('', api_home, name='api_home'),
    path('exercises/', exercises),
    path('analyze/', analyze_video_api),
    path('history/', analysis_history),
    path("quote/", quote),
    path("avg-form-score/", avg_form_score),
]
