from django.contrib import admin
from django.urls import path
from travel.views import health, destinations, trip_adapt
urlpatterns=[path('admin/',admin.site.urls),path('api/health/',health),path('api/destinations/',destinations),path('api/itinerary/adapt/',trip_adapt)]
