from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Case, When, IntegerField
from .models import Auto, RegistroEstacionamiento
from .serializers import AutoSerializer, RegistroEstacionamientoSerializer

class AutoViewSet(viewsets.ModelViewSet):
    queryset = Auto.objects.annotate(
        total_registros=Count('registros'),
        esta_estacionado=Count(
            Case(
                When(registros__fecha_salida__isnull=True, then=1),
                output_field=IntegerField()
            )
        )
    )
    serializer_class = AutoSerializer
    
    # Cupo máximo de autos en el estacionamiento
    CUPO_MAXIMO = 50
    
    def create(self, request, *args, **kwargs):
        # Verificar si hay cupo disponible
        autos_estacionados = RegistroEstacionamiento.objects.filter(
            fecha_salida__isnull=True
        ).count()
        
        if autos_estacionados >= self.CUPO_MAXIMO:
            return Response(
                {"error": f"No hay cupo disponible. Cupo máximo: {self.CUPO_MAXIMO}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def registrar_entrada(self, request, pk=None):
        auto = self.get_object()
        
        # Verificar si ya está estacionado
        registro_activo = RegistroEstacionamiento.objects.filter(
            auto=auto, 
            fecha_salida__isnull=True
        ).first()
        
        if registro_activo:
            return Response(
                {"error": "El auto ya se encuentra estacionado"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar cupo
        autos_estacionados = RegistroEstacionamiento.objects.filter(
            fecha_salida__isnull=True
        ).count()
        
        if autos_estacionados >= self.CUPO_MAXIMO:
            return Response(
                {"error": f"No hay cupo disponible. Cupo máximo: {self.CUPO_MAXIMO}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear nuevo registro de entrada
        registro = RegistroEstacionamiento.objects.create(
            auto=auto,
            observaciones=request.data.get('observaciones', '')
        )
        
        serializer = RegistroEstacionamientoSerializer(registro)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def registrar_salida(self, request, pk=None):
        auto = self.get_object()
        
        # Buscar registro activo
        registro = RegistroEstacionamiento.objects.filter(
            auto=auto, 
            fecha_salida__isnull=True
        ).first()
        
        if not registro:
            return Response(
                {"error": "El auto no se encuentra estacionado"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        registro.fecha_salida = timezone.now()
        registro.observaciones = request.data.get('observaciones', registro.observaciones)
        registro.save()
        
        serializer = RegistroEstacionamientoSerializer(registro)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def historial(self, request, pk=None):
        """Obtener historial completo de un auto"""
        auto = self.get_object()
        registros = auto.registros.all().order_by('-fecha_ingreso')
        
        page = self.paginate_queryset(registros)
        if page is not None:
            serializer = RegistroEstacionamientoSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = RegistroEstacionamientoSerializer(registros, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estacionados(self, request):
        """Lista de autos actualmente estacionados"""
        registros_activos = RegistroEstacionamiento.objects.filter(
            fecha_salida__isnull=True
        ).select_related('auto')
        
        page = self.paginate_queryset(registros_activos)
        if page is not None:
            serializer = RegistroEstacionamientoSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = RegistroEstacionamientoSerializer(registros_activos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Estadísticas del estacionamiento"""
        autos_estacionados = RegistroEstacionamiento.objects.filter(
            fecha_salida__isnull=True
        ).count()
        
        total_autos = Auto.objects.count()
        total_registros = RegistroEstacionamiento.objects.count()
        
        return Response({
            'cupo_maximo': self.CUPO_MAXIMO,
            'autos_estacionados': autos_estacionados,
            'cupo_disponible': self.CUPO_MAXIMO - autos_estacionados,
            'total_autos_registrados': total_autos,
            'total_entradas_registradas': total_registros
        })


class HistorialPorPatenteView(generics.ListAPIView):
    serializer_class = RegistroEstacionamientoSerializer
    
    def get_queryset(self):
        patente = self.kwargs['patente']
        auto = get_object_or_404(Auto, patente=patente)
        return RegistroEstacionamiento.objects.filter(auto=auto).order_by('-fecha_ingreso')


@api_view(['GET'])
def historial_patente(request, patente):
    """Endpoint alternativo para buscar historial por patente"""
    try:
        auto = Auto.objects.get(patente=patente)
        registros = auto.registros.all().order_by('-fecha_ingreso')
        
        serializer = RegistroEstacionamientoSerializer(registros, many=True)
        
        return Response({
            'auto': {
                'patente': auto.patente,
                'marca': auto.marca,
                'modelo': auto.modelo,
                'color': auto.color
            },
            'total_registros': registros.count(),
            'historial': serializer.data
        })
        
    except Auto.DoesNotExist:
        return Response(
            {"error": f"No se encontró ningún auto con patente {patente}"},
            status=status.HTTP_404_NOT_FOUND
        )