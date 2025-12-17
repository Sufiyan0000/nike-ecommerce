# apps/accounts/views.py

from rest_framework import viewsets, permissions
from rest_framework.response import Response

from django.contrib.auth import get_user_model

from .models import Address
from .serializers import AddressSerializer
from apps.core.permissions import IsOwnerOrReadOnly

User = get_user_model()


class AddressViewSet(viewsets.ModelViewSet):
    """
    /api/accounts/addresses/
    - User can CRUD only their own addresses
    """
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by("-is_default", "-id")

    def perform_create(self, serializer):
        # Optional: if is_default=True, unset other default addresses for this user
        address = serializer.save(user=self.request.user)
        if address.is_default:
            Address.objects.filter(
                user=self.request.user
            ).exclude(id=address.id).update(is_default=False)
        return address

    def perform_update(self, serializer):
        address = serializer.save()
        if address.is_default:
            Address.objects.filter(
                user=self.request.user
            ).exclude(id=address.id).update(is_default=False)
        return address
