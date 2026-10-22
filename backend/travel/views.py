import os
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Destination

def health(request): return JsonResponse({'status':'ok','service':'TravelMate Django'})

def destinations(request):
    data=list(Destination.objects.values('id','name','category','rating','budget','description'))
    return JsonResponse({'destinations':data})

@require_http_methods(['POST'])
def trip_adapt(request):
    import json
    body=json.loads(request.body or '{}')
    places=body.get('places',[])
    weather=body.get('weather','Normal'); crowd=body.get('crowd','Medium'); max_places=body.get('max_places')
    changes=[]; updated=places[:]
    if weather=='Rainy':
        indoor=[p for p in updated if p.get('type')=='indoor']
        if indoor:
            updated=indoor+[p for p in updated if p.get('type')!='indoor']
            changes.append('Indoor places moved earlier because rainy weather was selected.')
        else: changes.append('No indoor replacement was found; outdoor places remain with a warning.')
    if crowd=='High': updated=list(reversed(updated)); changes.append('Order changed to spread popular places across the day.')
    if isinstance(max_places,int) and max_places>0 and len(updated)>max_places:
        updated=updated[:max_places]; changes.append(f'Plan shortened to fit {max_places} places.')
    return JsonResponse({'updated_places':updated,'changes':changes or ['No major changes needed.']})
