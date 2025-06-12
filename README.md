# Task_Manager

Treść zadania:
Należy napisać aplikację back-end w technologii Python, Django, Django rest framework i Postgresql w najnowszej stabilnej wersji tego oprogramowania, której celem jest zarządzanie zadaniami.

Zadanie powinno posiadać następujące pola:
* id - kolejno nadawany numer,
* nazwa - krótki zwięzły tekst,
* opis - dłuższy tekst,
* status - może przyjmować jedną z 3 wartości (Nowy, W toku, Rozwiązany),
* przypisany użytkownik -  użytkownik dostępny w aplikacji.

Poprzez wystawione końcówki (HTTP API Endpoints) aplikacja powinna umożliwiać:


1.  Dodawanie zadania z wypełnionymi polami (wymienionymi wyżej). Przy czym pola te powinny być zgodne z poniższymi wymaganiami:
   * ID - nadawane automatycznie jako kolejne numery z sekwencji,
   * Nazwa - pole wymagane, podawane przez użytkownika,
   * Status (utworzonego zadania) -  domyślnie powinien być ustawiony jako 'Nowy'. Użytkownik powinien mieć możliwość zmiany statusu początkowego, z ustawionego domyślnie na inny dostępny dla tego pola.
   * Przypisany użytkownik - pole wypełniane opcjonalnie, może pozostać puste. Powinna być możliwość wyboru użytkownika z listy dostępnych użytkowników w aplikacji,
   * Opis -  pole wypełniane opcjonalnie, może pozostać puste.

2. Edycję zadania - opcja pozwalająca edytować wszystkie pola zadania oprócz id.

3. Przedstawienie filtrowanej listy zadań - opcja pozwalająca wyświetlić wszystkie zadania w systemie, z możliwością filtracji po każdym polu (tj. id, nazwie, opisie, statusie i użytkowniku). Przykładowo, powinna być możliwość wyświetlenia listy:
   * zadań przypisanych do danego użytkownika
   * wszystkich zadań rozwiązanych albo nowych albo w toku.
   * zadań zawierających w opisie lub nazwie dowolne słowo np. 'gotowanie', bez względu na wielkość liter.
4. Przedstawienie szczegółów zadania - opcja pozwalająca wyświetlić informacje o konkretnym zadaniu w systemie.
5. Usuwanie zadania - opcja pozwalająca usunąć dowolne zadanie w systemie.
6. Przedstawienie historii zmian zadań - opcja pozwala wyświetlić historię wszystkich dokonanych zmian dla zadań. Należy zapewnić odpowiednią filtrację pozwalającą wyświetlić np. tylko historię zmian dla danego zadania. Z końcówki powinna być możliwość otrzymania informacji, jakie dane zawierało zadanie w konkretnym czasie (np. jaki status miało dane zadanie kilka dni temu i do kogo było przypisane).

Dodatkowym atutem będzie jeśli:
* Aplikacja będzie posiadać system uprawnień,

Stworzona aplikacja powinna posiadać plik README.md, który będzie zawierać szczegółową instrukcję uruchomienia aplikacji. Powinna zawierać minimum informacje potrzebne do uruchomienia bazy danych i serwera aplikacji.
* Aplikacja będzie posiadać testy z użyciem pytest,
* Aplikacja będzie uruchomiona na serwerze gunicorn,

* W pliku README.md zawarta będzie dokumentacja przedstawiająca w jaki sposób można korzystać z API oraz przykładowe odpytania końcówek np. przy użyciu komendy curl.

sudo docker compose run --rm app sh -c "python manage.py"