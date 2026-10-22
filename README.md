# TravelMate – Smart Tourist & Trip Planning Website

A simple student-level Web Technologies lab project. The main novelty is a **What-If Smart Itinerary Simulator** that adapts a trip when weather, crowd, time, budget, walking, or transport conditions change.

## Quick demo
Open `frontend/index.html` directly in a browser, or use VS Code Live Server. The front-end demo works without the Django/Express servers and stores wishlist/trips/feedback in the browser.

## Extra lab modules
- `react-planner/index.html` – small ReactJS planner module.
- `admin/index.html` – small AngularJS admin dashboard module.
- `backend/` – Django + SQLite starter backend.
- `services/` – ExpressJS service layer starter.
- `xml/` – XML + DTD examples.
- `tests/` – Selenium example.
- `.github/workflows/ci.yml` – CI example.
- `database/mongodb_seed.json` – MongoDB sample seed documents.

## Local database
MongoDB is expected at `mongodb://127.0.0.1:27017`. Use MongoDB Compass to inspect it. The project does not require `mongosh`.

## Django setup
From `backend`:

```bash
python -m venv .venv
.venv\\Scripts\\activate
python -m pip install -r requirements.txt
python manage.py migrate
python seed_sqlite.py
python manage.py runserver
```

## Express setup
From `services`:

```bash
npm install
npm start
```

## Frontend
Use VS Code Live Server or any simple local HTTP server. A local server is recommended for browser APIs such as geolocation.

## Lab traceability
HTML5: semantic elements, forms/input types, audio, video, canvas, SVG, localStorage, geolocation, responsive viewport.

CSS3: flexbox, grid, media queries, transitions, animations, transforms, border-radius, box-shadow, gradients.

JavaScript: validation, events, DOM updates, dynamic itinerary and budget updates.

ReactJS: `react-planner/index.html`.

AngularJS: `admin/index.html`.

Django/SQLite: `backend/`.

MongoDB: `database/mongodb_seed.json` + application connection configuration.

ExpressJS/Web Services: `services/`.

XML/DTD: `xml/` + XML tools in the main demo.

Selenium: `tests/test_travelmate_selenium.py`.

CI/CD: `.github/workflows/ci.yml`.

## Note
The downloadable project is a **working student-level front-end demo plus full-stack lab scaffolding**. External weather/map providers still require your chosen provider credentials in `.env` before live API testing.
