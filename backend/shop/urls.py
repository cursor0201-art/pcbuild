from .views import CategoryViewSet, ProductViewSet, OrderViewSet, AIBuilderView, ping_view

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)

# API URLs are configured automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    path('ai-build/', AIBuilderView.as_view(), name='ai-build'),
    path('ping/', ping_view, name='ping'),
]
