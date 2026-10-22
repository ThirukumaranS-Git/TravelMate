from django.db import models
class Destination(models.Model):
    name=models.CharField(max_length=100)
    category=models.CharField(max_length=50)
    rating=models.FloatField(default=0)
    budget=models.IntegerField(default=0)
    description=models.TextField(blank=True)
    def __str__(self): return self.name
class Trip(models.Model):
    destination=models.CharField(max_length=100)
    travel_date=models.DateField(null=True,blank=True)
    days=models.PositiveIntegerField(default=1)
    people=models.PositiveIntegerField(default=1)
    budget=models.PositiveIntegerField(default=0)
    itinerary=models.JSONField(default=list)
    created_at=models.DateTimeField(auto_now_add=True)
class Review(models.Model):
    destination=models.CharField(max_length=100)
    rating=models.PositiveSmallIntegerField(default=5)
    text=models.TextField()
class Feedback(models.Model):
    name=models.CharField(max_length=100)
    email=models.EmailField()
    rating=models.PositiveSmallIntegerField(default=5)
    text=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)
