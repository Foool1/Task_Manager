from rest_framework import serializers
from django.contrib.auth.models import User
from core.models import Task

class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User(username=validated_data['username'], email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']



class TaskSerializer(serializers.ModelSerializer):
    przypisany_uzytkownik = SimpleUserSerializer(read_only=True)
    przypisany_uzytkownik_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='przypisany_uzytkownik', write_only=True, required=False
    )

    class Meta:
        model = Task
        fields = ['id', 'nazwa', 'opis', 'status', 'przypisany_uzytkownik', 'przypisany_uzytkownik_id']


class TaskHistorySerializer(serializers.ModelSerializer):
    history_date = serializers.DateTimeField()
    history_user = serializers.StringRelatedField()
    history_type = serializers.CharField()

    class Meta:
        model = Task.history.model
        fields = '__all__'
