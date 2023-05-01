from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from main.router import router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('image/', include(router.urls))
]+static(settings.MEDIA_URL, documents_root=settings.MEDIA_ROOT)
