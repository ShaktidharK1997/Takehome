from django.shortcuts import render
from django.db.models import Max, F
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from rest_framework import filters, generics
from .models import EnvironmentalData, EnvironmentDataCategories
from .serializers import EnvironmentalDataSerializer, EnvironmentDataCategoriesSerializer
from django.db.models import Avg,Max, Min, Sum
from datetime import datetime
from django.utils.dateparse import parse_date
# Create your views here.

@api_view(['GET'])
def latest_metrics(request):
        max_timestamp = EnvironmentalData.objects.aggregate(max_date=Max('envi_time_stamp'))['max_date']
        
        # Get all entries with that maximum timestamp
        latest_data = EnvironmentalData.objects.filter(envi_time_stamp=max_timestamp)
        
        # Serialize the data
        serializer = EnvironmentalDataSerializer(latest_data, many=True)
        
        # Return the serialized data
        return Response(serializer.data)

class EnvironmentalDataCategoryTimeSeries(ListAPIView):
    queryset = EnvironmentalData.objects.all()
    serializer_class = EnvironmentalDataSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['envi_time_stamp']

    def get_queryset(self):
        """
        Optionally restricts the returned data to a given category,
        by filtering against a `category` query parameter in the URL.
        """
        queryset = self.queryset
        category_name= self.request.query_params.get('category')
        
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        # Defaulting to far past and far future dates if not provided
        if not start_date:
            start_date = '1900-01-01'

        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d') 

        if category_name is not None:
            queryset = queryset.filter(category__category_name=category_name)


        queryset = queryset.filter(envi_time_stamp__range=[start_date, end_date])
        
        return queryset.order_by('envi_time_stamp')  # Oldest entries first
    

@api_view(['GET'])
def aggregated_metrics(request):
    # Retrieve the category name and operation type from query parameters
    category_name = request.query_params.get('category', None)
    operation = request.query_params.get('operation', 'avg')  # Default to 'avg' if not specified

    print("Category Name:", category_name)

    start_date = request.query_params.get('start_date', None)
    end_date = request.query_params.get('end_date', None)

    if not start_date:
        start_date = '1900-01-01'

    if not end_date:
        end_date = datetime.now().strftime('%Y-%m-%d') 

    # Filter the queryset based on the category name
    queryset = EnvironmentalData.objects.all()
    if category_name:
        # Debug: Check what the queryset returns after filter
        queryset = queryset.filter(category__category_name=category_name)
        print("Filtered Queryset Count:", queryset.count())

    # Filter the queryset based on the date range

    queryset = queryset.filter(envi_time_stamp__range=[start_date, end_date])


    # Dictionary to map operation parameters to Django aggregation functions
    operation_mapping = {
        'avg': Avg('value'),
        'max': Max('value'),
        'min': Min('value'),
        'sum': Sum('value')
    }

    # Get the aggregation function from the operation parameter, default to Avg if invalid operation is provided
    aggregation_function = operation_mapping.get(operation, Avg('value'))

    # Perform the aggregation
    aggregated_data = queryset.values('category__category_name').annotate(
        aggregated_value=aggregation_function
    ).order_by('category__category_name')

    return Response(aggregated_data)


@api_view(['GET'])
def metrics(request):
    # Retrieve the date for which to retrieve the metrics for 
    date = request.query_params.get('date', None)

    if date is None:
        return Response({"error": "Please provide a date parameter in the format YYYY-MM-DD"}, status=400)

    else:
        # Filter the queryset based on the date
        date_obj = parse_date(date)
        queryset = EnvironmentalData.objects.filter(envi_time_stamp=date_obj)

        # Serialize the data
        serializer = EnvironmentalDataSerializer(queryset, many=True)

        return Response(serializer.data)

class EnvironmentDataCategoriesList(generics.ListAPIView):
    queryset = EnvironmentDataCategories.objects.all()
    serializer_class = EnvironmentDataCategoriesSerializer