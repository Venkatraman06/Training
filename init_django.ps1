$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path "c:\projects\Training\backend"
cd c:\projects\Training\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install django djangorestframework django-cors-headers
django-admin startproject trainops_backend .
python manage.py startapp core
python manage.py migrate
