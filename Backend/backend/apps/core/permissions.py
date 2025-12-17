# apps/core/permissions.py

from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    SAFE_METHODS (GET, HEAD, OPTIONS) are allowed for everyone.
    Write operations require is_staff = True.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission: owner can read/write, others read-only (or denied).
    Assumes the model has a `user` field.
    """

    def has_object_permission(self, request, view, obj):
        # Read-only allowed
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write allowed only for owner or staff
        return bool(
            request.user
            and request.user.is_authenticated
            and (obj.user == request.user or request.user.is_staff)
        )
