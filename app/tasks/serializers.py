from rest_framework import serializers
from django.contrib.auth.models import User
from core.models import Task

class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Hasła nie są takie same.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User(username=validated_data['username'], email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class TaskSerializer(serializers.ModelSerializer):
    przypisany_uzytkownik = RegisterUserSerializer(read_only=True)
    przypisany_uzytkownik_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='przypisany_uzytkownik', write_only=True, required=False
    )

    class Meta:
        model = Task
        fields = ['id', 'nazwa', 'opis', 'status', 'przypisany_uzytkownik', 'przypisany_uzytkownik_id']
