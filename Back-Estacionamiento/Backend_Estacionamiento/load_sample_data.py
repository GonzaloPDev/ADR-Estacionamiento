import os
import django
import random
from datetime import datetime, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend_Estacionamiento.settings')
django.setup()

from parking.models import Auto, RegistroEstacionamiento
from django.db.models import Count

def crear_autos_ejemplo():
    """Crear autos de ejemplo con datos realistas"""
    
    autos_data = [
        # Toyota
        {"modelo": "Corolla", "marca": "Toyota", "color": "Blanco", "patente": "AA123BB"},
        {"modelo": "Hilux", "marca": "Toyota", "color": "Gris", "patente": "AB456CD"},
        {"modelo": "RAV4", "marca": "Toyota", "color": "Negro", "patente": "AC789EF"},
        {"modelo": "Yaris", "marca": "Toyota", "color": "Rojo", "patente": "AD012GH"},
        
        # Ford
        {"modelo": "Fiesta", "marca": "Ford", "color": "Azul", "patente": "BA234IJ"},
        {"modelo": "Focus", "marca": "Ford", "color": "Blanco", "patente": "BB567KL"},
        {"modelo": "Ranger", "marca": "Ford", "color": "Verde", "patente": "BC890MN"},
        {"modelo": "Mustang", "marca": "Ford", "color": "Rojo", "patente": "BD123OP"},
        
        # Chevrolet
        {"modelo": "Cruze", "marca": "Chevrolet", "color": "Plateado", "patente": "CA345QR"},
        {"modelo": "S10", "marca": "Chevrolet", "color": "Negro", "patente": "CB678ST"},
        {"modelo": "Onix", "marca": "Chevrolet", "color": "Blanco", "patente": "CC901UV"},
        {"modelo": "Tracker", "marca": "Chevrolet", "color": "Azul", "patente": "CD234WX"},
        
        # Volkswagen
        {"modelo": "Gol", "marca": "Volkswagen", "color": "Rojo", "patente": "DA456YZ"},
        {"modelo": "Polo", "marca": "Volkswagen", "color": "Gris", "patente": "DB789AB"},
        {"modelo": "Amarok", "marca": "Volkswagen", "color": "Negro", "patente": "DC012CD"},
        {"modelo": "Virtus", "marca": "Volkswagen", "color": "Blanco", "patente": "DD345EF"},
        
        # Honda
        {"modelo": "Civic", "marca": "Honda", "color": "Plateado", "patente": "EA567GH"},
        {"modelo": "HR-V", "marca": "Honda", "color": "Azul", "patente": "EB890IJ"},
        {"modelo": "CR-V", "marca": "Honda", "color": "Verde", "patente": "EC123KL"},
        {"modelo": "Fit", "marca": "Honda", "color": "Rojo", "patente": "ED456MN"},
        
        # Fiat
        {"modelo": "Cronos", "marca": "Fiat", "color": "Blanco", "patente": "FA678OP"},
        {"modelo": "Argo", "marca": "Fiat", "color": "Negro", "patente": "FB901QR"},
        {"modelo": "Pulse", "marca": "Fiat", "color": "Gris", "patente": "FC234ST"},
        {"modelo": "Strada", "marca": "Fiat", "color": "Azul", "patente": "FD567UV"},
        
        # Renault
        {"modelo": "Kwid", "marca": "Renault", "color": "Rojo", "patente": "GA890WX"},
        {"modelo": "Sandero", "marca": "Renault", "color": "Blanco", "patente": "GB123YZ"},
        {"modelo": "Duster", "marca": "Renault", "color": "Naranja", "patente": "GC456AB"},
        {"modelo": "Logan", "marca": "Renault", "color": "Gris", "patente": "GD789CD"},
        
        # Peugeot
        {"modelo": "208", "marca": "Peugeot", "color": "Azul", "patente": "HA012EF"},
        {"modelo": "308", "marca": "Peugeot", "color": "Blanco", "patente": "HB345GH"},
        {"modelo": "2008", "marca": "Peugeot", "color": "Negro", "patente": "HC678IJ"},
        {"modelo": "Partner", "marca": "Peugeot", "color": "Plateado", "patente": "HD901KL"},
    ]
    
    autos_creados = []
    for auto_data in autos_data:
        auto, created = Auto.objects.get_or_create(
            patente=auto_data['patente'],
            defaults=auto_data
        )
        autos_creados.append(auto)
        if created:
            print(f"✅ Auto creado: {auto}")
        else:
            print(f"⚠️  Auto ya existe: {auto}")
    
    return autos_creados

def crear_registros_estacionamiento(autos, dias_atras=30, max_registros_por_auto=8):
    """Crear registros de estacionamiento realistas"""
    
    print("\n" + "="*50)
    print("CREANDO REGISTROS DE ESTACIONAMIENTO")
    print("="*50)
    
    registros_creados = 0
    
    for auto in autos:
        # Número aleatorio de registros para este auto (1-8)
        num_registros = random.randint(1, max_registros_por_auto)
        
        print(f"\n📋 Creando {num_registros} registros para {auto.patente}")
        
        for i in range(num_registros):
            # Fecha aleatoria en los últimos 'dias_atras' días
            dias_aleatorio = random.randint(0, dias_atras)
            fecha_base = datetime.now() - timedelta(days=dias_aleatorio)
            
            # Hora de entrada aleatoria (entre 6:00 y 20:00)
            hora_entrada = random.randint(6, 20)
            minuto_entrada = random.randint(0, 59)
            
            fecha_entrada = fecha_base.replace(
                hour=hora_entrada, 
                minute=minuto_entrada, 
                second=0, 
                microsecond=0
            )
            
            # 80% de probabilidad de que ya haya salido
            if random.random() < 0.8:
                # Tiempo estacionado (30 minutos a 8 horas)
                horas_estacionado = random.uniform(0.5, 8)
                fecha_salida = fecha_entrada + timedelta(hours=horas_estacionado)
                observaciones = random.choice([
                    None,
                    "Cliente regular",
                    "Primera visita",
                    "Estacionamiento rápido",
                    "Compra en supermercado",
                    "Visita médica",
                    "Trabajo en oficina",
                    ""
                ])
            else:
                # Auto todavía estacionado
                fecha_salida = None
                observaciones = "Actualmente estacionado"
            
            # Crear el registro
            registro = RegistroEstacionamiento.objects.create(
                auto=auto,
                fecha_ingreso=fecha_entrada,
                fecha_salida=fecha_salida,
                observaciones=observaciones
            )
            
            registros_creados += 1
            
            estado = "🅿️  ESTACIONADO" if fecha_salida is None else "🚗 RETIRADO"
            print(f"   {estado} - Entrada: {fecha_entrada.strftime('%Y-%m-%d %H:%M')}")
    
    return registros_creados

def limpiar_datos_previos():
    """Eliminar datos existentes (opcional)"""
    print("🧹 Limpiando datos previos...")
    
    confirmacion = input("¿Desea eliminar todos los datos existentes? (s/N): ")
    
    if confirmacion.lower() == 's':
        RegistroEstacionamiento.objects.all().delete()
        Auto.objects.all().delete()
        print("✅ Datos anteriores eliminados")
    else:
        print("ℹ️  Manteniendo datos existentes")

def mostrar_estadisticas():
    """Mostrar estadísticas de la base de datos"""
    total_autos = Auto.objects.count()
    total_registros = RegistroEstacionamiento.objects.count()
    autos_estacionados = RegistroEstacionamiento.objects.filter(fecha_salida__isnull=True).count()
    
    print("\n" + "="*50)
    print("📊 ESTADÍSTICAS DE LA BASE DE DATOS")
    print("="*50)
    print(f"Total de autos: {total_autos}")
    print(f"Total de registros: {total_registros}")
    print(f"Autos actualmente estacionados: {autos_estacionados}")
    
    # Top 5 autos con más visitas
    print("\n🏆 Top 5 autos con más visitas:")
    autos_con_mas_visitas = Auto.objects.annotate(
        num_visitas=Count('registros')
    ).order_by('-num_visitas')[:5]
    
    for i, auto in enumerate(autos_con_mas_visitas, 1):
        print(f"  {i}. {auto.patente} - {auto.marca} {auto.modelo} ({auto.num_visitas} visitas)")

def main():
    """Función principal"""
    print("🚗 SCRIPT DE CARGA DE DATOS DE EJEMPLO")
    print("🚗 Estacionamiento - Django REST Framework")
    print("="*50)
    
    try:
        # Opcional: limpiar datos previos
        limpiar_datos_previos()
        
        # Crear autos de ejemplo
        print("\n" + "="*50)
        print("CREANDO AUTOS DE EJEMPLO")
        print("="*50)
        
        autos = crear_autos_ejemplo()
        print(f"\n✅ Total de autos creados/mantenidos: {len(autos)}")
        
        # Crear registros de estacionamiento
        registros_creados = crear_registros_estacionamiento(autos)
        print(f"\n✅ Total de registros creados: {registros_creados}")
        
        # Mostrar estadísticas finales
        mostrar_estadisticas()
        
        print("\n🎉 ¡Carga de datos completada exitosamente!")
        print("\n📋 Puedes probar los endpoints:")
        print("   GET /api/autos/ - Listar todos los autos")
        print("   GET /api/historial/AA123BB/ - Ver historial por patente")
        print("   GET /api/autos/estacionados/ - Autos estacionados")
        print("   GET /api/autos/estadisticas/ - Estadísticas")
        
    except Exception as e:
        print(f"\n❌ Error durante la carga de datos: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()