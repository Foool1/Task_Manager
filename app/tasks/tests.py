import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from core.models import Task

pytestmark = pytest.mark.django_db

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='testpass')

@pytest.fixture
def auth_client(user, client):
    response = client.post('/api/login/', data={'username': 'testuser', 'password': 'testpass'})
    token = response.data['token']
    client.credentials(HTTP_AUTHORIZATION='Token ' + token)
    return client

@pytest.fixture
def task(user):
    return Task.objects.create(nazwa='Zadanie testowe', status='Nowy', przypisany_uzytkownik=user)

def test_register_user(client):
    response = client.post('/api/register/', {
        'username': 'nowyuser',
        'email': 'nowy@example.com',
        'password': 'nowehaslo123'
    })
    assert response.status_code == 201
    assert User.objects.filter(username='nowyuser').exists()

def test_create_task(auth_client):
    response = auth_client.post('/api/tasks/', {
        'nazwa': 'Nowe zadanie',
        'status': 'W toku'
    })
    assert response.status_code == 201
    assert Task.objects.filter(nazwa='Nowe zadanie').exists()

def test_edit_task(auth_client, task):
    url = f'/api/tasks/{task.id}/'
    response = auth_client.put(url, {
        'nazwa': 'Zmieniona nazwa',
        'status': 'Rozwiązany',
        'przypisany_uzytkownik_id': task.przypisany_uzytkownik.id
    }, format='json')
    assert response.status_code == 200
    task.refresh_from_db()
    assert task.nazwa == 'Zmieniona nazwa'
    assert task.status == 'Rozwiązany'

def test_filter_tasks_by_status(auth_client, user):
    Task.objects.create(nazwa='A', status='Nowy', przypisany_uzytkownik=user)
    Task.objects.create(nazwa='B', status='Rozwiązany', przypisany_uzytkownik=user)
    response = auth_client.get('/api/tasks/', {'status': 'Rozwiązany'})
    assert response.status_code == 200
    for task in response.data:
        assert task['status'] == 'Rozwiązany'

def test_delete_task(auth_client, task):
    url = f'/api/tasks/{task.id}/'
    response = auth_client.delete(url)
    assert response.status_code == 204
    assert not Task.objects.filter(id=task.id).exists()

def test_task_history(auth_client, task):
    task.status = 'Rozwiązany'
    task.save()
    response = auth_client.get(f'/tasks/{task.id}/history/')
    assert response.status_code == 200
    assert len(response.data) >= 1
    assert any(h['status'] == 'Rozwiązany' for h in response.data)

def test_auth_required(client):
    response = client.get('/api/tasks/')
    assert response.status_code == 401
