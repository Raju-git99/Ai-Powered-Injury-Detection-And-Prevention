from rest_framework import serializers
from .models import UserProfile
from .models import ExerciseRecord

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "username",
            "name",
            "gender",
            "age",
            "height_cm",
            "weight_kg",
        ]

class ExerciseRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseRecord
        fields = "__all__"