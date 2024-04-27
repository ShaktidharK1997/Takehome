from django.core.management.base import BaseCommand
from datetime import datetime
import pandas as pd
from site_v1.models import EnvironmentalData, EnvironmentDataCategories

class Command(BaseCommand):
    help = 'Import environmental data from an Excel file'

    def add_arguments(self, parser):
        parser.add_argument('filename', type=str, help='The path to the Excel file to import')

    def handle(self, *args, **options):
        # Load the Excel file and transpose it
        df = pd.read_excel(options['filename'], engine='openpyxl').transpose()

        # Get the header which contains the dates
        header = df.iloc[0]

        # This will contain the rest of the data below the header
        data = df[1:]

        # Iterate through the first row to get the categories and units
        for category in header:
            category_name, unit = category.rsplit(' ', 1)
            unit = unit.strip('()')  # Clean up the unit
            self.stdout.write(f'Category: {category_name}, Unit: {unit}')

            # Get or create the category
            category_obj, created = EnvironmentDataCategories.objects.get_or_create(
                category_name=category_name,
                defaults={'category_metric': unit}
            )

        # Iterate over each date and the associated row
        for timestamp, row in data.iterrows():

            if not isinstance(timestamp, pd.Timestamp):
                date = pd.to_datetime(timestamp).date()
            print(date)
            
            # Now iterate over each value in the row, which corresponds to each category
            for idx, value in enumerate(row):
                # Find the corresponding category from the database
                try:
                    category_name = header[idx].rsplit(' ', 1)[0]
                    category_obj = EnvironmentDataCategories.objects.get(category_name=category_name)
                except EnvironmentDataCategories.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'Category does not exist: {category_name}'))
                    continue

                # Create the environmental data entry
                EnvironmentalData.objects.create(
                    category=category_obj,
                    envi_time_stamp=date,
                    value=value if pd.notnull(value) else 0  # Replace NaN with 0 or other default value
                )

        self.stdout.write(self.style.SUCCESS('Successfully imported environmental data.'))
