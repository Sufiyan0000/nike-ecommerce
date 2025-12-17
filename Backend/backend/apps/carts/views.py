# apps/carts/views.py

import uuid
from django.utils import timezone
from django.conf import settings

from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action

from django.contrib.auth import get_user_model

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from apps.core.permissions import IsOwnerOrReadOnly
from apps.auth_app.models import Guest  # your existing Guest model

User = get_user_model()


class CartViewSet(viewsets.ModelViewSet):
    """
    /api/carts/
    In practice, usually you only expose:
      - GET /api/carts/current/ (custom action)
      - POST /api/carts/current/add_item/
    But here we keep a generic ViewSet.
    """
    queryset = Cart.objects.select_related("user", "guest").all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Cart.objects.filter(user=user).select_related("user", "guest")
        # Guests usually use other endpoints (current cart via guest_id)
        return Cart.objects.none()

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

    # Helper method to resolve current cart (user or guest)
    def _get_or_create_current_cart(self, request):
        user = request.user if request.user.is_authenticated else None
        guest_id = request.headers.get("X-Guest-Id") or request.query_params.get("guest_id")

        if user:
            cart, _ = Cart.objects.get_or_create(user=user)
            return cart, None

        if guest_id:
            guest, _ = Guest.objects.get_or_create(
                session_token=guest_id,
                defaults={"expires_at": timezone.now() + timezone.timedelta(days=7)},
            )
            cart, _ = Cart.objects.get_or_create(guest=guest)
            return cart, guest_id

        # No user, no guest -> create a new guest
        new_guest_id = uuid.uuid4().hex
        guest = Guest.objects.create(
            session_token=new_guest_id,
            expires_at=timezone.now() + timezone.timedelta(days=7),
        )
        cart = Cart.objects.create(guest=guest)
        return cart, new_guest_id

    @action(detail=False, methods=["get"], url_path="current")
    def current_cart(self, request):
        """
        GET /api/carts/current/
        Returns current cart for user or guest.
        If guest cart is newly created, returns a generated guest_id.
        """
        cart, guest_id = self._get_or_create_current_cart(request)
        data = CartSerializer(cart).data
        if guest_id:
            data["guest_id"] = guest_id
        return Response(data)

    @action(detail=False, methods=["post"], url_path="current/add-item")
    def add_item(self, request):
        """
        POST /api/carts/current/add-item/
        Body: { "product_variant": "<uuid>", "quantity": 1 }
        """
        cart, guest_id = self._get_or_create_current_cart(request)

        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_variant = serializer.validated_data["product_variant"]
        quantity = serializer.validated_data.get("quantity", 1)

        # Update or create item
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_variant=product_variant,
            defaults={"quantity": quantity},
        )
        if not created:
            item.quantity += quantity
            item.save()

        data = CartSerializer(cart).data
        if guest_id:
            data["guest_id"] = guest_id

        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="current/clear")
    def clear_cart(self, request):
        """
        POST /api/carts/current/clear/
        Clears all items from current cart.
        """
        cart, guest_id = self._get_or_create_current_cart(request)
        cart.items.all().delete()
        data = CartSerializer(cart).data
        if guest_id:
            data["guest_id"] = guest_id
        return Response(data, status=status.HTTP_200_OK)


class CartItemViewSet(viewsets.ModelViewSet):
    """
    CRUD on individual cart items – usually used less once you have add-item/clear endpoints.
    """
    queryset = CartItem.objects.select_related("cart", "product_variant").all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return CartItem.objects.filter(cart__user=user).select_related(
                "cart", "product_variant"
            )
        return CartItem.objects.none()
