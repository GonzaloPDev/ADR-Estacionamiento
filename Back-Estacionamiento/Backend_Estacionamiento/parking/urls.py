from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AutoViewSet, HistorialPorPatenteView, historial_patente

router = DefaultRouter()
router.register(r'autos', AutoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Historial por patente - dos formas de hacerlo
    path('historial/patente/<str:patente>/', 
         HistorialPorPatenteView.as_view(), 
         name='historial-patente'),
    path('historial/<str:patente>/', 
         historial_patente, 
         name='historial-patente-alt'),
]