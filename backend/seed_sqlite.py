import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','travelmate_api.settings')
import django
django.setup()
from travel.models import Destination
items=[('Ooty','Hill Station',4.7,2200),('Kodaikanal','Hill Station',4.6,2300),('Munnar','Nature',4.8,2600),('Coorg','Adventure',4.7,2400),('Chennai','Beach',4.4,1800),('Madurai','Historical',4.6,1700),('Mysuru','Historical',4.7,1900),('Kochi','Food',4.5,2100),('Bandipur','Wildlife',4.6,2500)]
for n,c,r,b in items: Destination.objects.get_or_create(name=n,defaults={'category':c,'rating':r,'budget':b,'description':f'Sample TravelMate information for {n}.'})
print('Seeded',Destination.objects.count(),'destinations.')
