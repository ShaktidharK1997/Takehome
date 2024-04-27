from django.urls import path
from .views import latest_metrics, EnvironmentalDataCategoryTimeSeries, aggregated_metrics, EnvironmentDataCategoriesList, metrics

urlpatterns = [
    path('categories/', EnvironmentDataCategoriesList.as_view(), name='category-list'),
    path('latest_metrics/', latest_metrics, name = 'latest_metrics'),
    path('time_series/', EnvironmentalDataCategoryTimeSeries.as_view(), name='time_series'),
    path('aggregated_metrics/', aggregated_metrics, name = 'aggregated_metrics'),
    path('metrics/',metrics, name='metrics' )
]