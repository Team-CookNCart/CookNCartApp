"""
URL configuration for recipe_app_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import AllSavedRecipes, UserSavedRecipes, UserSingleRecipe

urlpatterns = [
    path('', AllSavedRecipes.as_view(), name='all_saved_recipes'),
    path('user/<int:user_id>/', UserSavedRecipes.as_view(), name='user_saved_recipes'),
    path('user/<int:user_id>/recipe/<int:recipe_id>/', UserSingleRecipe.as_view(), name='user_saved_recipe')
    

]
