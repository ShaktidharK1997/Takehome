from rest_framework import serializers
from .models import EnvironmentalData, EnvironmentDataCategories

class EnvironmentDataCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentDataCategories
        fields = '__all__'

class EnvironmentalDataSerializer(serializers.ModelSerializer):
    category = EnvironmentDataCategoriesSerializer(read_only=True)
    
    class Meta:
        model = EnvironmentalData
        fields = '__all__'



