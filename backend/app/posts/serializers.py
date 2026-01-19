from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from core.models import Post, Comment

class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        token, created = Token.objects.get_or_create(user=instance)
        data['token'] = token.key
        return data


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    author_id = serializers.ReadOnlyField(source='author.id')

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_id', 'content', 'created_at', 'updated_at']
        read_only_fields = ['author', 'author_id', 'created_at', 'updated_at']


class PostSerializer(serializers.ModelSerializer):
    przypisany_uzytkownik = SimpleUserSerializer(read_only=True)
    przypisany_uzytkownik_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='przypisany_uzytkownik', write_only=True, required=False
    )
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'nazwa', 'opis', 'status', 'przypisany_uzytkownik',
            'przypisany_uzytkownik_id', 'created_at', 'updated_at',
            'comments', 'image'
        ]


class PostHistorySerializer(serializers.ModelSerializer):
    history_date = serializers.DateTimeField()
    history_user = serializers.StringRelatedField()
    history_type = serializers.CharField()

    class Meta:
        model = Post.history.model
        fields = '__all__'
