import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from core.models import Post

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
def post(user):
    return Post.objects.create(nazwa='Zadanie testowe', status='Nowy', przypisany_uzytkownik=user)

def test_register_user(client):
    response = client.post('/api/register/', {
        'username': 'nowyuser',
        'email': 'nowy@example.com',
        'password': 'nowehaslo123'
    })
    assert response.status_code == 201
    assert User.objects.filter(username='nowyuser').exists()

def test_create_post(auth_client):
    response = auth_client.post('/api/posts/', {
        'nazwa': 'Nowe zadanie',
        'status': 'W toku'
    })
    assert response.status_code == 201
    assert Post.objects.filter(nazwa='Nowe zadanie').exists()

def test_edit_post(auth_client, post):
    url = f'/api/posts/{post.id}/'
    response = auth_client.put(url, {
        'nazwa': 'Zmieniona nazwa',
        'status': 'Rozwiązany',
        'przypisany_uzytkownik_id': post.przypisany_uzytkownik.id
    }, format='json')
    assert response.status_code == 200
    post.refresh_from_db()
    assert post.nazwa == 'Zmieniona nazwa'
    assert post.status == 'Rozwiązany'

def test_filter_posts_by_status(auth_client, user):
    Post.objects.create(nazwa='A', status='Nowy', przypisany_uzytkownik=user)
    Post.objects.create(nazwa='B', status='Rozwiązany', przypisany_uzytkownik=user)
    response = auth_client.get('/api/posts/', {'status': 'Rozwiązany'})
    assert response.status_code == 200
    for post in response.data:
        assert post['status'] == 'Rozwiązany'

def test_delete_post(auth_client, post):
    url = f'/api/posts/{post.id}/'
    response = auth_client.delete(url)
    assert response.status_code == 204
    assert not Post.objects.filter(id=post.id).exists()

def test_post_history(auth_client, post):
    post.status = 'Rozwiązany'
    post.save()
    response = auth_client.get(f'/posts/{post.id}/history/')
    assert response.status_code == 200
    assert len(response.data) >= 1
    assert any(h['status'] == 'Rozwiązany' for h in response.data)

def test_auth_required(client):
    response = client.get('/api/posts/')
    assert response.status_code == 401
