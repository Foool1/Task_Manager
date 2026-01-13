from rest_framework import permissions

class IsAuthenticatedOrOptions(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if request.method == 'OPTIONS':
            return True

        return super().has_permission(request, view)


class IsOwnerOrReadOnly(permissions.BasePermission):


    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.przypisany_uzytkownik == request.user