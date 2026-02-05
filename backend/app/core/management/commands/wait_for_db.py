from django.core.management.base import BaseCommand
from django.db.utils import OperationalError
from psycopg2 import OperationalError as psycopg2OpError
import time


class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write('Waiting for database...')
        db_up = False
        while not db_up:
            try:
                # To nie tylko sprawdza port, ale próbuje wykonać operację na bazie
                from django.db import connection
                connection.ensure_connection()
                db_up = True
            except (psycopg2OpError, OperationalError):
                self.stdout.write('Database unavailable, waiting 1 second...')
                time.sleep(1)

        self.stdout.write(self.style.SUCCESS('Database available!'))
        # Kluczowe: dajemy bazie sekundę na "odetchnięcie" po połączeniu
        time.sleep(1)