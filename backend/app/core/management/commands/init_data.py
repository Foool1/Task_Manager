from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Post, Comment
from django.utils import timezone
import os
from django.core.files import File
from django.conf import settings

User = get_user_model()

source_img_dir = os.path.join(settings.BASE_DIR, 'media', 'post_images')
print("DEBUG: Skrypt init_data.py został załadowany!")
class Command(BaseCommand):
    help = 'Wypełnia bazę danych danymi startowymi (Admin, Posty, Komentarze)'

    def handle(self, *args, **kwargs):
        self.stdout.write('Rozpoczynam inicjalizację danych...')

        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@example.com', 'is_superuser': True, 'is_staff': True}
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Utworzono Admina (login: admin, hasło: admin123)'))
        else:
            self.stdout.write('Admin już istnieje.')

        user, created = User.objects.get_or_create(
            username='jan_kowalski',
            defaults={'email': 'jan@example.com'}
        )
        if created:
            user.set_password('user123')
            user.save()
            self.stdout.write(self.style.SUCCESS('Utworzono użytkownika Jan Kowalski'))

        posts_data = [
            {
                'nazwa': 'Jak powstawała moja aplikacja – od pomysłu do działającego projektu',
                'opis': """<p>Każdy projekt zaczyna się od pomysłu. W moim przypadku była to potrzeba stworzenia miejsca, w którym użytkownik może w prosty sposób publikować treści, zarządzać nimi oraz testować funkcjonalności nowoczesnej aplikacji webowej. Chciałem połączyć praktyczne zastosowanie technologii z projektem, który będzie miał realną wartość edukacyjną.</p>
                        <p>Pierwszym etapem było zaprojektowanie architektury aplikacji. Zdecydowałem się na podejście oparte na frameworku webowym, który pozwala na szybkie tworzenie backendu, obsługę bazy danych oraz integrację z frontendem. Kluczowe było zaplanowanie modeli danych – wpisów, użytkowników oraz relacji między nimi. Dzięki temu już na starcie wiedziałem, jak aplikacja będzie się rozwijać.</p>
                        <p>Kolejnym krokiem było stworzenie podstawowych funkcjonalności: dodawanie postów, ich edycja, usuwanie oraz wyświetlanie w czytelnej formie. Na tym etapie duże znaczenie miała dbałość o strukturę kodu – separacja logiki biznesowej od warstwy prezentacji oraz przygotowanie aplikacji na dalszą rozbudowę.</p>
                        <p>Nie obyło się bez problemów. Największym wyzwaniem okazało się zarządzanie stanem aplikacji i poprawna obsługa zapytań do bazy danych. W trakcie pracy wielokrotnie wracałem do dokumentacji i testowałem różne podejścia, aż udało się osiągnąć stabilne i przewidywalne działanie systemu.</p>
                        <p>Dziś aplikacja jest nie tylko projektem zaliczeniowym, ale także dowodem na to, jak wiele można nauczyć się poprzez praktykę. To doświadczenie pokazało mi, że najważniejsze w tworzeniu oprogramowania są konsekwencja, cierpliwość i gotowość do rozwiązywania problemów.</p>""",
                'img_file': 'Post1.png',
                'status': 'Aktywny',
                'author': admin
            },
            {
                'nazwa': 'Dlaczego warto budować własne projekty programistyczne',
                'opis': """<p>Nauka programowania nie kończy się na kursach i tutorialach. Prawdziwe zrozumienie technologii pojawia się dopiero wtedy, gdy zaczynamy budować własne rozwiązania. Projekty własne pozwalają popełniać błędy, eksperymentować i uczyć się w tempie dopasowanym do własnych możliwości.</p>
                        <p>Tworzenie aplikacji od zera uczy planowania. Trzeba zdecydować, jakie funkcje są kluczowe, jakie można dodać później oraz jak zaprojektować system, który będzie skalowalny. To zupełnie inne doświadczenie niż rozwiązywanie pojedynczych zadań programistycznych.</p>
                        <p>Kolejną zaletą jest rozwój umiejętności rozwiązywania problemów. W trakcie pracy nad projektem pojawiają się błędy, konflikty zależności, problemy z wydajnością czy integracją usług zewnętrznych. Każde takie wyzwanie zmusza do analizy, czytania dokumentacji i testowania hipotez.</p>
                        <p>Własne projekty budują również portfolio. Pokazują nie tylko znajomość języka programowania, ale także umiejętność pracy z architekturą aplikacji, bazami danych, interfejsami użytkownika oraz narzędziami deweloperskimi. Dla pracodawcy to często bardziej wartościowe niż same certyfikaty.</p>
                        <p>Najważniejsze jest jednak to, że projekty dają satysfakcję. Moment, w którym aplikacja zaczyna działać zgodnie z założeniami, jest najlepszą motywacją do dalszego rozwoju i nauki kolejnych technologii.</p>""",
                'img_file': 'Post2.png',
                'status': 'Nowy',
                'author': user
            },
            {
                'nazwa': 'Technologie, które zmieniają sposób tworzenia aplikacji webowych',
                'opis': """<p>W ostatnich latach rozwój technologii webowych znacząco przyspieszył. Frameworki backendowe, biblioteki frontendowe oraz narzędzia do automatyzacji pracy sprawiają, że tworzenie aplikacji jest szybsze i bardziej dostępne niż kiedykolwiek wcześniej.</p>
                        <p>Jednym z kluczowych trendów jest podejście oparte na API. Oddzielenie backendu od frontendowej warstwy prezentacji pozwala budować systemy elastyczne i gotowe na rozwój. Ta sama logika biznesowa może obsługiwać stronę internetową, aplikację mobilną czy integracje z zewnętrznymi usługami.</p>
                        <p>Duże znaczenie mają także narzędzia konteneryzacyjne i systemy kontroli wersji. Pozwalają one pracować zespołowo, testować rozwiązania w różnych środowiskach i wdrażać aplikacje w sposób przewidywalny. Dzięki temu proces developmentu staje się bardziej uporządkowany.</p>
                        <p>Nie można pominąć roli społeczności open source. Dostęp do gotowych bibliotek, dokumentacji i przykładów sprawia, że nawet skomplikowane funkcje można wdrożyć szybciej. Programista nie zaczyna już od zera – buduje na fundamentach tworzonych przez tysiące innych osób.</p>
                        <p>Patrząc w przyszłość, można spodziewać się dalszej automatyzacji i integracji narzędzi. Coraz większą rolę odgrywa także sztuczna inteligencja wspierająca tworzenie kodu, analizę danych i optymalizację aplikacji. To sprawia, że rola programisty ewoluuje – z osoby piszącej kod w projektanta rozwiązań technologicznych.</p>""",
                'img_file': 'Post3.png',
                'status': 'Nowy',
                'author': user
            }
        ]

        created_posts = []
        for p_data in posts_data:
            post, created = Post.objects.get_or_create(
                nazwa=p_data['nazwa'],
                defaults={
                    'opis': p_data['opis'],
                    'status': p_data['status'],
                    'przypisany_uzytkownik': p_data['author'],
                }
            )

            if created:
                created_posts.append(post)

                path_to_img = os.path.join(source_img_dir, p_data['img_file'])

                if os.path.exists(path_to_img):
                    with open(path_to_img, 'rb') as f:
                        post.image.save(p_data['img_file'], File(f), save=True)
                    self.stdout.write(f"Dodano zdjęcie: {p_data['img_file']} do posta: {post.nazwa}")
                else:
                    self.stdout.write(self.style.WARNING(f"Brak pliku zdjęcia: {path_to_img}"))
            else:
                 self.stdout.write(f"Post '{post.nazwa}' już istnieje - pomijam.")

        self.stdout.write(self.style.SUCCESS(f'Utworzono {len(created_posts)} nowych postów.'))

        target_post_name = 'Jak powstawała moja aplikacja – od pomysłu do działającego projektu'

        if Post.objects.filter(nazwa=target_post_name).exists():
            welcome_post = Post.objects.get(nazwa=target_post_name)

            if not Comment.objects.filter(post=welcome_post).exists():
                Comment.objects.create(
                    post=welcome_post,
                    author=user,
                    content="Świetny artykuł! Widać napracowanko :)"
                )
                Comment.objects.create(
                    post=welcome_post,
                    author=admin,
                    content="Dzięki, staramy się rozwijać projekt!"
                )
                self.stdout.write(self.style.SUCCESS('Dodano przykładowe komentarze.'))

        self.stdout.write(self.style.SUCCESS('--- SKOŃCZONE! Baza danych jest gotowa do prezentacji ---'))
