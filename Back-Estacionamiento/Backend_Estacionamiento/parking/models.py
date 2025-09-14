from django.db import models

class Auto(models.Model):
    MARCAS = [
        ('Toyota', 'Toyota'),
        ('Ford', 'Ford'),
        ('Chevrolet', 'Chevrolet'),
        ('Honda', 'Honda'),
        ('Volkswagen', 'Volkswagen'),
        ('Fiat', 'Fiat'),
        ('Renault', 'Renault'),
        ('Peugeot', 'Peugeot'),
        ('Otro', 'Otro'),
    ]
    
    COLORES = [
        ('Rojo', 'Rojo'),
        ('Azul', 'Azul'),
        ('Verde', 'Verde'),
        ('Negro', 'Negro'),
        ('Blanco', 'Blanco'),
        ('Gris', 'Gris'),
        ('Plateado', 'Plateado'),
        ('Otro', 'Otro'),
    ]
    
    modelo = models.CharField(max_length=100)
    marca = models.CharField(max_length=20, choices=MARCAS)
    color = models.CharField(max_length=20, choices=COLORES)
    patente = models.CharField(max_length=10, unique=True)
    
    class Meta:
        ordering = ['patente']
    
    def __str__(self):
        return f"{self.marca} {self.modelo} - {self.patente}"


class RegistroEstacionamiento(models.Model):
    auto = models.ForeignKey(Auto, on_delete=models.CASCADE, related_name='registros')
    fecha_ingreso = models.DateTimeField(auto_now_add=True)
    fecha_salida = models.DateTimeField(null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-fecha_ingreso']
    
    def __str__(self):
        estado = "Estacionado" if self.fecha_salida is None else "Retirado"
        return f"{self.auto.patente} - {self.fecha_ingreso} - {estado}"
    
    @property
    def tiempo_estacionado(self):
        if self.fecha_salida:
            return self.fecha_salida - self.fecha_ingreso
        return None