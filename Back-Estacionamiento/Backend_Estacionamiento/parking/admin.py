from django.contrib import admin
from .models import Auto, RegistroEstacionamiento

class RegistroEstacionamientoInline(admin.TabularInline):
    model = RegistroEstacionamiento
    extra = 0
    readonly_fields = ['fecha_ingreso', 'fecha_salida']
    can_delete = False

@admin.register(Auto)
class AutoAdmin(admin.ModelAdmin):
    list_display = ['patente', 'marca', 'modelo', 'color', 'total_registros']
    list_filter = ['marca', 'color']
    search_fields = ['patente', 'modelo']
    inlines = [RegistroEstacionamientoInline]
    
    def total_registros(self, obj):
        return obj.registros.count()
    total_registros.short_description = 'Total Visitas'

@admin.register(RegistroEstacionamiento)
class RegistroEstacionamientoAdmin(admin.ModelAdmin):
    list_display = ['auto', 'fecha_ingreso', 'fecha_salida', 'tiempo_estacionado']
    list_filter = ['fecha_ingreso', 'fecha_salida']
    search_fields = ['auto__patente', 'auto__modelo']
    readonly_fields = ['fecha_ingreso', 'fecha_salida']
    
    def tiempo_estacionado(self, obj):
        if obj.tiempo_estacionado:
            horas = obj.tiempo_estacionado.total_seconds() / 3600
            return f"{horas:.2f} horas"
        return "En estacionamiento"
    tiempo_estacionado.short_description = 'Tiempo'