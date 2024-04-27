from django.db import models

# Create your models here.
from django.db import models

class EnvironmentDataCategories(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    category_metric = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.category_name} ({self.category_metric})"

class EnvironmentalData(models.Model):
    category = models.ForeignKey(EnvironmentDataCategories, on_delete=models.CASCADE)
    envi_time_stamp = models.DateField()
    value = models.FloatField()

    def __str__(self):
        return f"{self.category.category_name} at {self.envi_time_stamp}: {self.value}"
