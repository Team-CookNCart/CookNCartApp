from rest_framework import serializers
from .models import ShoppingListItem
from .units import UNIT_DISPLAY_NAMES



class ShoppingListItemSerializer(serializers.ModelSerializer):
    measure = serializers.SerializerMethodField()

    class Meta:
        model = ShoppingListItem
        fields = ['id', 'user', 'item', 'qty', 'measure']
    
    def get_measure(self, obj):
        return UNIT_DISPLAY_NAMES.get(obj.measure, obj.measure or "")


class RecipeSerializer(serializers.Serializer):
    meals = serializers.ListField()

    def create(self, validated_data):
        user = self.context['request'].user  # Get the user from request
        meals = validated_data['meals']
        items = []

        for meal in meals:
            for i in range(1, 21):  # Loop through ingredient fields (1-20)
                ingredient = meal.get(f"strIngredient{i}")
                if ingredient and ingredient.strip():  # Ignore empty or null values
                    items.append(ShoppingListItem(user=user, item=ingredient.strip()))

        # Bulk create for efficiency
        ShoppingListItem.objects.bulk_create(items)
        return {"message": "Ingredients added to shopping list."}
        