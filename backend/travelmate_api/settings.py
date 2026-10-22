from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY') or 'travelmate-student-dev-key'
DEBUG = os.getenv('DEBUG','True').lower()=='true'
ALLOWED_HOSTS = [h.strip() for h in os.getenv('DJANGO_ALLOWED_HOSTS','127.0.0.1,localhost').split(',') if h.strip()]
INSTALLED_APPS = ['django.contrib.admin','django.contrib.auth','django.contrib.contenttypes','django.contrib.sessions','django.contrib.messages','django.contrib.staticfiles','rest_framework','travel']
MIDDLEWARE = ['django.middleware.security.SecurityMiddleware','django.contrib.sessions.middleware.SessionMiddleware','django.middleware.common.CommonMiddleware','django.middleware.csrf.CsrfViewMiddleware','django.contrib.auth.middleware.AuthenticationMiddleware','django.contrib.messages.middleware.MessageMiddleware']
ROOT_URLCONF='travelmate_api.urls'
TEMPLATES=[{'BACKEND':'django.template.backends.django.DjangoTemplates','DIRS':[],'APP_DIRS':True,'OPTIONS':{'context_processors':['django.template.context_processors.request','django.contrib.auth.context_processors.auth','django.contrib.messages.context_processors.messages']}}]
WSGI_APPLICATION='travelmate_api.wsgi.application'
raw_sqlite_path = os.getenv('SQLITE_DB_PATH')
if raw_sqlite_path:
    sqlite_path = Path(raw_sqlite_path)
    if not sqlite_path.is_absolute():
        sqlite_path = BASE_DIR.parent / sqlite_path
else:
    sqlite_path = BASE_DIR / 'db.sqlite3'
DATABASES={'default':{'ENGINE':'django.db.backends.sqlite3','NAME':str(sqlite_path)}}
LANGUAGE_CODE='en-us'; TIME_ZONE='Asia/Kolkata'; USE_I18N=True; USE_TZ=True
STATIC_URL='static/'
DEFAULT_AUTO_FIELD='django.db.models.BigAutoField'
