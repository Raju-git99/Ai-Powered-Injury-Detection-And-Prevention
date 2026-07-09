from django.db import models
from django.contrib.auth.models import User

class AnalysisRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    exercise = models.CharField(max_length=100)
    risk_percent = models.IntegerField()
    accuracy_score = models.IntegerField(null=True, blank=True)
    fault = models.CharField(max_length=200)
    original_video = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )

    processed_video = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.exercise} - {self.risk_percent}%"




# from django.db import models
# from django.contrib.auth.models import User

# class AnalysisRecord(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     exercise = models.CharField(max_length=100)
#     risk_percent = models.IntegerField()
#     accuracy_score = models.IntegerField(null=True, blank=True)
#     fault = models.CharField(max_length=200)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.exercise} - {self.risk_percent}%"