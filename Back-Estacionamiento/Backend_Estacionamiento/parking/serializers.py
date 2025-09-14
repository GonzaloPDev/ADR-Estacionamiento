from rest_framework import serializers
from .models import Auto, RegistroEstacionamiento

class RegistroEstacionamientoSerializer(serializers.ModelSerializer):
    tiempo_estacionado = serializers.SerializerMethodField()
    patente = serializers.CharField(source='auto.patente', read_only=True)
    modelo = serializers.CharField(source='auto.modelo', read_only=True)
    marca = serializers.CharField(source='auto.marca', read_only=True)
    
    class Meta:
        model = RegistroEstacionamiento
        fields = ['id', 'patente', 'modelo', 'marca', 'fecha_ingreso', 
                 'fecha_salida', 'tiempo_estacionado', 'observaciones']
    
    def get_tiempo_estacionado(self, obj):
        if obj.fecha_salida:
            tiempo = obj.fecha_salida - obj.fecha_ingreso
            horas = tiempo.total_seconds() / 3600
            return f"{horas:.2f} horas"
        return "En estacionamiento"

class AutoSerializer(serializers.ModelSerializer):
    estado_actual = serializers.SerializerMethodField()
    total_visitas = serializers.SerializerMethodField()
    
    class Meta:
        model = Auto
        fields = ['id', 'modelo', 'marca', 'color', 'patente', 
                 'estado_actual', 'total_visitas']
    
    def get_estado_actual(self, obj):
        ultimo_registro = obj.registros.order_by('-fecha_ingreso').first()
        if ultimo_registro and ultimo_registro.fecha_salida is None:
            return "Estacionado"
        return "No estacionado"
    
    def get_total_visitas(self, obj):
        return obj.registros.count()
    
    def validate_patente(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("La patente debe tener al menos 6 caracteres")
        return value