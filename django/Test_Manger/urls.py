from django.urls import path
from Test_Manger.Test_Kit import Test_Kit_Action
from Test_Manger.Test_Team import Test_Team_Action
urlpatterns = [
    path('Test_Kit/',Test_Kit_Action),
    path('Test_Team/',Test_Team_Action),
]
