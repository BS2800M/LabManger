from django.urls import path
from Reagent_Manger.Template import Reagent_Template_Action
from Reagent_Manger.Lot import Reagent_Lot_Action
from Reagent_Manger.Operation import Reagent_Operation_Action




urlpatterns = [
    path('Reagent_template/',Reagent_Template_Action),
    path('Reagent_Lot/',Reagent_Lot_Action),
    path('Reagent_Operation/',Reagent_Operation_Action)
]