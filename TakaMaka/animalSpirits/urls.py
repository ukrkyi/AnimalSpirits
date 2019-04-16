from django.conf.urls import url
from . import views

app_name = 'animalSpirits'

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'about/', views.about, name='about'),
    url(r'aboutUs/', views.aboutUs, name='aboutUs'),
    url(r'rules/', views.rules, name='rules'),
    url(r'timer/', views.timer, name='timer'),
]