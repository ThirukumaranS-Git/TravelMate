const destinations = [
  {id:1,name:'Ooty',category:'Hill Station',rating:4.7,budget:2200,type:'outdoor',duration:8,lat:11.4102,lng:76.6950,image:'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=900&q=80',desc:'Cool hills, gardens and viewpoints.'},
  {id:2,name:'Kodaikanal',category:'Hill Station',rating:4.6,budget:2300,type:'outdoor',duration:8,lat:10.2381,lng:77.4892,image:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',desc:'Lakes, pine forests and easy hill walks.'},
  {id:3,name:'Munnar',category:'Nature',rating:4.8,budget:2600,type:'outdoor',duration:8,lat:10.0889,lng:77.0595,image:'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80',desc:'Tea gardens and mountain scenery.'},
  {id:4,name:'Coorg',category:'Adventure',rating:4.7,budget:2400,type:'outdoor',duration:7,lat:12.3375,lng:75.8069,image:'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=900&q=80',desc:'Coffee estates, waterfalls and trails.'},
  {id:5,name:'Chennai',category:'Beach',rating:4.4,budget:1800,type:'outdoor',duration:6,lat:13.0827,lng:80.2707,image:'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=900&q=80',desc:'Coastal views, food and city attractions.'},
  {id:6,name:'Madurai',category:'Historical',rating:4.6,budget:1700,type:'indoor',duration:6,lat:9.9252,lng:78.1198,image:'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=900&q=80',desc:'Historic temples and local culture.'},
  {id:7,name:'Mysuru',category:'Historical',rating:4.7,budget:1900,type:'indoor',duration:7,lat:12.2958,lng:76.6394,image:'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',desc:'Palaces, markets and heritage walks.'},
  {id:8,name:'Kochi',category:'Food',rating:4.5,budget:2100,type:'indoor',duration:6,lat:9.9312,lng:76.2673,image:'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=80',desc:'Food, waterfronts and colonial streets.'},
  {id:9,name:'Bandipur',category:'Wildlife',rating:4.6,budget:2500,type:'outdoor',duration:7,lat:11.6667,lng:76.6333,image:'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',desc:'Wildlife viewing and forest landscapes.'}
];

const state = { currentTrip:null, map:null, markerLayer:null };

function qs(id){return document.getElementById(id)}
function saveJSON(key,val){localStorage.setItem(key,JSON.stringify(val))}
function loadJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}

function routeTo(route){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const target=qs(`view-${route}`); if(target) target.classList.add('active');
  document.querySelectorAll('[data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===route));
  if(history.replaceState) history.replaceState(null,'',`#${route}`);
  if(route==='map') setTimeout(initMap,100);
  if(route==='wishlist') renderWishlist();
  if(route==='trips') renderTrips();
  if(route==='admin') renderAdmin();
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',e=>{
  e.preventDefault(); routeTo(el.dataset.route); document.querySelector('.nav-links')?.classList.remove('open');
}));

document.querySelector('.menu-toggle').addEventListener('click',()=>document.querySelector('.nav-links').classList.toggle('open'));
qs('loginNav').addEventListener('click',()=>routeTo('login'));

function destinationCard(d){
  return `<article class="place-card">
    <div class="place-image" style="background-image:url('${d.image}')"></div>
    <div class="place-body">
      <div class="place-top"><h3>${d.name}</h3><span class="pill">★ ${d.rating}</span></div>
      <div class="place-meta">${d.category} · approx ₹${d.budget} · ${d.duration}h</div>
      <p>${d.desc}</p>
      <div class="card-actions"><button class="outline-btn small addWish" data-id="${d.id}">♡ Wishlist</button><button class="primary-btn small addTripPlace" data-id="${d.id}">Add to Trip</button></div>
    </div>
  </article>`;
}

function bindCardButtons(){
  document.querySelectorAll('.addWish').forEach(btn=>btn.addEventListener('click',()=>{
    const d=destinations.find(x=>x.id==btn.dataset.id); const w=loadJSON('travelmate_wishlist',[]);
    if(!w.some(x=>x.id===d.id)) {w.push(d); saveJSON('travelmate_wishlist',w); btn.textContent='♥ Saved';} else btn.textContent='♥ Saved';
  }));
  document.querySelectorAll('.addTripPlace').forEach(btn=>btn.addEventListener('click',()=>{
    const d=destinations.find(x=>x.id==btn.dataset.id); const places=state.currentTrip?.places||[];
    const merged=[...places.filter(p=>p.name!==d.name),{name:d.name,cost:d.budget,duration:Math.min(3,d.duration/2),type:d.type,category:d.category,lat:d.lat,lng:d.lng}];
    state.currentTrip=state.currentTrip||{destination:d.name,days:1,people:1,budget:d.budget*2,places:[]}; state.currentTrip.places=merged;
    renderItinerary(); routeTo('planner');
  }));
}

function renderHome(){
  qs('homeDestinations').innerHTML=destinations.slice(0,3).map(destinationCard).join('');
  bindCardButtons(); qs('destCount').textContent=destinations.length;
}
function renderExplore(list=destinations){
  qs('exploreGrid').innerHTML=list.length?list.map(destinationCard).join(''):`<div class="empty-state">No destinations match these filters.</div>`;
  bindCardButtons();
}

function applyFilters(){
  const q=qs('searchInput').value.trim().toLowerCase(); const cat=qs('categoryFilter').value; const b=Number(qs('budgetFilter').value||Infinity); const r=Number(qs('ratingFilter').value); const type=qs('typeFilter').value;
  renderExplore(destinations.filter(d=>(!q||`${d.name} ${d.category} ${d.desc}`.toLowerCase().includes(q))&&(cat==='all'||d.category===cat)&&d.budget<=b&&d.rating>=r&&(type==='all'||d.type===type)));
}
['searchInput','categoryFilter','budgetFilter','ratingFilter','typeFilter'].forEach(id=>qs(id).addEventListener('input',applyFilters));

function defaultPlaces(){return [
  {name:'Botanical Garden',cost:300,duration:2,type:'outdoor',category:'Nature',lat:11.4167,lng:76.7114},
  {name:'Tea Museum',cost:250,duration:1.5,type:'indoor',category:'History',lat:11.4064,lng:76.7040},
  {name:'Ooty Lake',cost:350,duration:2,type:'outdoor',category:'Nature',lat:11.4030,lng:76.6789},
  {name:'Doddabetta Viewpoint',cost:500,duration:2,type:'outdoor',category:'Nature',lat:11.4000,lng:76.7350}
]}

function createPlan(destination,days,budget,people){
  let places=defaultPlaces(); if(destination==='Kodaikanal') places=[{name:'Coaker\'s Walk',cost:200,duration:1.5,type:'outdoor',category:'Nature',lat:10.2323,lng:77.4876},{name:'Pine Forest',cost:0,duration:2,type:'outdoor',category:'Nature',lat:10.189,lng:77.49},{name:'Bryant Park',cost:100,duration:1.5,type:'outdoor',category:'Nature',lat:10.2395,lng:77.4890},{name:'Kodaikanal Lake',cost:300,duration:2,type:'outdoor',category:'Nature',lat:10.2381,lng:77.4892}];
  if(destination==='Munnar') places=[{name:'Tea Museum',cost:200,duration:1.5,type:'indoor',category:'History',lat:10.0875,lng:77.0580},{name:'Tea Gardens',cost:300,duration:2,type:'outdoor',category:'Nature',lat:10.0700,lng:77.0600},{name:'Mattupetty Dam',cost:250,duration:2,type:'outdoor',category:'Nature',lat:10.1120,lng:77.1180},{name:'Echo Point',cost:200,duration:1.5,type:'outdoor',category:'Nature',lat:10.0836,lng:77.2026}];
  const selected=places.slice(0,Math.max(2,Math.min(4,days*2))); return {destination,days,budget,people,places:selected,baseTotal:selected.reduce((s,p)=>s+p.cost,0)*people,createdAt:new Date().toISOString()};
}

qs('tripForm').addEventListener('submit',e=>{e.preventDefault();
  const days=Number(qs('tripDays').value),people=Number(qs('tripPeople').value),budget=Number(qs('tripBudget').value),date=qs('tripDate').value;
  qs('tripFormError').textContent=''; if(!date||days<1||people<1||budget<500){qs('tripFormError').textContent='Please enter a valid date, people count and budget.';return}
  state.currentTrip=createPlan(qs('tripDestination').value,days,budget,people); state.currentTrip.date=date; state.currentTrip.transport=qs('tripTransport').value; state.currentTrip.walking=qs('tripWalking').value; qs('simulatorBadge').textContent='Ready'; renderItinerary();
});

function renderItinerary(){
  const t=state.currentTrip; if(!t)return; const places=t.places; const perDay=Math.ceil(places.length/t.days); let dayHtml='';
  for(let day=1;day<=t.days;day++){
    const dayPlaces=places.slice((day-1)*perDay,day*perDay); if(!dayPlaces.length) continue;
    dayHtml+=`<div class="itinerary-card"><strong>Day ${day}</strong>${dayPlaces.map((p,i)=>`<div class="it-row"><span class="it-time">${i? '12:30 PM':'09:00 AM'}</span><div><strong>${p.name}</strong><div class="it-desc">${p.category} · ${p.duration}h · ${p.type}</div></div><span class="it-cost">₹${p.cost}</span></div>`).join('')}</div>`;
  }
  qs('itineraryContent').innerHTML=dayHtml+`<div class="it-footer"><span>Estimated attraction cost: <strong>₹${t.baseTotal*t.people/t.people}</strong></span><span>Trip budget: <strong>₹${t.budget}</strong></span></div>`;
}
qs('saveTripBtn').addEventListener('click',()=>{
  if(!state.currentTrip){alert('Generate a trip first.');return} const trips=loadJSON('travelmate_trips',[]); trips.unshift({...state.currentTrip,id:Date.now()}); saveJSON('travelmate_trips',trips); alert('Trip saved locally.'); renderTrips();
});

function adaptPlan(){
  const t=state.currentTrip; if(!t){qs('whatifResult').innerHTML='<div class="status">Generate an itinerary first.</div>';return}
  const weather=qs('simWeather').value,crowd=qs('simCrowd').value,time=qs('simTime').value,budgetChange=qs('simBudget').value,walking=qs('simWalking').value,transport=qs('simTransport').value;
  let updated=t.places.map(p=>({...p})); const changes=[];
  if(weather==='Rainy') {const indoor=updated.find(p=>p.type==='indoor'); if(indoor) {updated.sort((a,b)=>(b.type==='indoor')-(a.type==='indoor')); changes.push('Indoor places moved earlier because rainy weather was selected.');} else changes.push('No indoor replacement was available, so the plan keeps outdoor places with a warning.');}
  if(weather==='Very Hot'){updated.sort((a,b)=>(a.type==='outdoor')-(b.type==='outdoor')); changes.push('Outdoor activities were moved later to avoid the hottest part of the day.');}
  if(crowd==='High'){updated.reverse(); changes.push('Popular places were reordered to spread the crowd across the day.');}
  const maxPlaces=time==='2 Hours'?1:time==='4 Hours'?2:time==='6 Hours'?3:updated.length; if(updated.length>maxPlaces){updated=updated.slice(0,maxPlaces);changes.push(`The plan was shortened to fit ${time}.`)}
  let factor=budgetChange==='-10%'?.9:budgetChange==='-20%'?.8:budgetChange==='-30%'?.7:1;
  const originalTotal=updated.reduce((s,p)=>s+p.cost,0)*t.people; if(factor<1 && originalTotal*t.people>t.budget*factor){updated=updated.slice(0,Math.max(1,updated.length-1));changes.push('A lower-cost option was chosen by removing one lower-priority paid stop.');}
  if(walking==='Low'){updated=updated.slice(0,Math.min(updated.length,2));changes.push('The plan was simplified to reduce walking between stops.');}
  if(transport==='Public Transport') changes.push('Public transport was selected; keep the route near main transport points.');
  if(!changes.length) changes.push('No major changes were necessary for the selected conditions.');
  const newCost=updated.reduce((s,p)=>s+p.cost,0)*t.people; const why=changes.map(x=>`<li>${x}</li>`).join('');
  qs('whatifResult').innerHTML=`<div class="compare-box"><span class="eyebrow">Original plan</span><ul class="change-list">${t.places.map(p=>`<li>${p.name}</li>`).join('')}</ul></div><div class="compare-box updated"><span class="eyebrow">Adapted plan</span><ul class="change-list">${updated.map(p=>`<li>${p.name}</li>`).join('')}</ul><p><strong>New estimated attraction cost:</strong> ₹${newCost}</p></div><div class="compare-box" style="grid-column:1/-1"><span class="eyebrow">What changed and why?</span><ul class="change-list">${why}</ul></div>`;
};
qs('adaptBtn').addEventListener('click',adaptPlan);

function renderWishlist(){const w=loadJSON('travelmate_wishlist',[]);qs('wishlistGrid').innerHTML=w.length?w.map(destinationCard).join(''):`<div class="empty-state">Your wishlist is empty. Add a place from Explore.</div>`;bindCardButtons()}
function renderTrips(){const trips=loadJSON('travelmate_trips',[]);qs('tripsList').innerHTML=trips.length?trips.map(t=>`<div class="list-item"><div class="section-heading"><div><strong>${t.destination}</strong><div class="place-meta">${t.date||'Flexible'} · ${t.days} day(s) · ${t.people} people</div></div><button class="outline-btn small deleteTrip" data-id="${t.id}">Delete</button></div><p>${t.places.map(p=>p.name).join(' → ')}</p><span class="pill">Budget ₹${t.budget}</span></div>`).join(''):`<div class="empty-state">No saved trips yet.</div>`;document.querySelectorAll('.deleteTrip').forEach(b=>b.addEventListener('click',()=>{saveJSON('travelmate_trips',trips.filter(t=>t.id!=b.dataset.id));renderTrips()}));}

qs('feedbackRating').addEventListener('input',()=>qs('feedbackRatingValue').textContent=qs('feedbackRating').value);
qs('feedbackForm').addEventListener('submit',e=>{e.preventDefault();const n=qs('feedbackName').value.trim(),em=qs('feedbackEmail').value.trim(),text=qs('feedbackText').value.trim();if(!n||!em.includes('@')||!text){qs('feedbackMsg').textContent='Please fill all fields correctly.';return}const f=loadJSON('travelmate_feedback',[]);f.unshift({name:n,email:em,rating:Number(qs('feedbackRating').value),text,createdAt:new Date().toISOString()});saveJSON('travelmate_feedback',f);e.target.reset();qs('feedbackRating').value=4;qs('feedbackRatingValue').textContent='4';qs('feedbackMsg').textContent='Thank you! Feedback saved for the demo.';});

function xmlForTrip(t=state.currentTrip){if(!t)return `<trip><destination>Ooty</destination><day number="1"><place>Botanical Garden</place><time>09:00</time></day></trip>`;let xml=`<trip>\n  <destination>${t.destination}</destination>\n`;t.places.forEach((p,i)=>{xml+=`  <day number="${Math.floor(i/2)+1}">\n    <place>${p.name}</place>\n    <time>${i%2?'12:30':'09:00'}</time>\n  </day>\n`});return xml+'</trip>'}
const sampleXml=`<trip>\n  <destination>Ooty</destination>\n  <day number="1">\n    <place>Botanical Garden</place>\n    <time>09:00</time>\n  </day>\n  <day number="1">\n    <place>Tea Museum</place>\n    <time>12:30</time>\n  </day>\n</trip>`;
qs('loadSampleXml').addEventListener('click',()=>qs('xmlInput').value=state.currentTrip?xmlForTrip():sampleXml);
qs('formatXmlBtn').addEventListener('click',()=>{const raw=qs('xmlInput').value.trim();if(!raw){qs('xmlMsg').textContent='Paste or generate XML first.';return}try{const doc=new DOMParser().parseFromString(raw,'application/xml');if(doc.querySelector('parsererror'))throw new Error('Malformed XML');const root=doc.documentElement;const pad=(n)=>'  '.repeat(n);let out='';function walk(node,depth){if(node.nodeType!==1)return;const attrs=[...node.attributes].map(a=>` ${a.name}="${a.value}"`).join('');const kids=[...node.children];const text=(node.textContent||'').trim();if(!kids.length&&text){out+=pad(depth)+`<${node.tagName}${attrs}>${text}</${node.tagName}>\n`}else{out+=pad(depth)+`<${node.tagName}${attrs}>\n`;kids.forEach(k=>walk(k,depth+1));out+=pad(depth)+`</${node.tagName}>\n`}}walk(root,0);qs('xmlInput').value=out.trim();qs('xmlMsg').textContent='XML formatted successfully.'}catch(err){qs('xmlMsg').textContent=err.message}});
qs('validateXmlBtn').addEventListener('click',()=>{const raw=qs('xmlInput').value.trim();try{const doc=new DOMParser().parseFromString(raw,'application/xml');if(doc.querySelector('parsererror'))throw new Error('Malformed XML');const root=doc.documentElement;if(root.tagName!=='trip')throw new Error('Root element must be <trip>.');if(!root.querySelector('destination'))throw new Error('<destination> is required.');if(!root.querySelector('day'))throw new Error('At least one <day> is required.');for(const day of root.querySelectorAll('day')){if(!day.querySelector('place')||!day.querySelector('time'))throw new Error('Each <day> needs <place> and <time>.')}qs('xmlMsg').textContent='Valid according to the TravelMate trip structure.'}catch(e){qs('xmlMsg').textContent='Validation failed: '+e.message}});

qs('loginForm').addEventListener('submit',e=>{e.preventDefault();const email=qs('loginEmail').value,password=qs('loginPassword').value;if(!email||password.length<6){qs('loginMsg').textContent='Enter a valid email and a 6+ character password.';return}localStorage.setItem('travelmate_user',email);qs('loginMsg').textContent='Demo login successful.';setTimeout(()=>routeTo('home'),500)});

function renderAdmin(){const f=loadJSON('travelmate_feedback',[]),t=loadJSON('travelmate_trips',[]);qs('adminStats').innerHTML=[['Users',loadJSON('travelmate_user',null)?1:0],['Trips',t.length],['Destinations',destinations.length],['Feedback',f.length]].map(x=>`<div class="dash-card"><strong>${x[1]}</strong><span>${x[0]}</span></div>`).join('');qs('adminFeedback').innerHTML=f.length?f.slice(0,5).map(x=>`<div class="list-item"><strong>${x.name}</strong> · ${'★'.repeat(x.rating)}<p>${x.text}</p></div>`).join(''):'<div class="empty-state">No feedback yet.</div>'}

qs('nearMeBtn').addEventListener('click',()=>{const s=qs('nearMeStatus');if(!navigator.geolocation){s.hidden=false;s.textContent='Geolocation is not supported by this browser.';return}s.hidden=false;s.textContent='Requesting your location...';navigator.geolocation.getCurrentPosition(pos=>{const {latitude,longitude}=pos.coords;const withDist=destinations.map(d=>({...d,distance:distanceKm(latitude,longitude,d.lat,d.lng)})).sort((a,b)=>a.distance-b.distance).slice(0,5);s.textContent=`Nearest places: ${withDist.map(x=>`${x.name} (${x.distance.toFixed(1)} km)`).join(', ')}`;renderExplore(withDist)},()=>{s.textContent='Location permission was denied or unavailable. You can still use the destination filters.'})});
function distanceKm(a,b,c,d){const r=6371,rad=x=>x*Math.PI/180;const x=rad(c-a),y=rad(d-b);const z=Math.sin(x/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(y/2)**2;return 2*r*Math.atan2(Math.sqrt(z),Math.sqrt(1-z))}

function initMap(){if(!window.L){qs('mapFallback').hidden=false;return}qs('mapFallback').hidden=true;if(state.map) state.map.remove();state.map=L.map('map').setView([11.4102,76.6950],9);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(state.map);state.markerLayer=L.layerGroup().addTo(state.map);destinations.forEach(d=>L.marker([d.lat,d.lng]).addTo(state.markerLayer).bindPopup(`<b>${d.name}</b><br>${d.category}`));qs('mapPlaces').innerHTML=destinations.slice(0,6).map(d=>`<div class="list-item"><strong>${d.name}</strong><div class="place-meta">${d.category} · ${d.rating} ★</div><p>${d.desc}</p></div>`).join('')}
qs('mapCurrentBtn').addEventListener('click',()=>{if(!navigator.geolocation){alert('Geolocation is not supported.');return}navigator.geolocation.getCurrentPosition(p=>{if(state.map){const {latitude,longitude}=p.coords;state.map.setView([latitude,longitude],12);L.marker([latitude,longitude]).addTo(state.map).bindPopup('You are here').openPopup();}},()=>alert('Location could not be read.'))});

qs('dtdPreview').textContent=`<!ELEMENT trip (destination, day+)>\n<!ELEMENT destination (#PCDATA)>\n<!ELEMENT day (place, time)>\n<!ELEMENT place (#PCDATA)>\n<!ELEMENT time (#PCDATA)>`;

const initialHash=location.hash.replace('#','')||'home';renderHome();renderExplore();routeTo(['home','explore','planner','map','trips','wishlist','feedback','xml','login','admin'].includes(initialHash)?initialHash:'home');
