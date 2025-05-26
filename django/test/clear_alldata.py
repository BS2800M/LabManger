import os
import sys
import django
from django.conf import settings

# 添加 Django 项目根目录到 Python 路径
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.append(project_root)

# 设置 Django 设置模块
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from Reagent_Manger.models import Reagent_Template, Reagent_Lot, Reagent_Operation, Reagent_Warning
from Test_Manger.models import Test_Team
def clear_all_data():
    print('开始清空数据...')
    
    # 先删除有外键依赖的表
    Test_Team.objects.all().delete()
    print('已清空 test team 数据')

    Reagent_Operation.objects.all().delete()
    print('已清空 Reagent_Operation 数据')
    
    Reagent_Warning.objects.all().delete()
    print('已清空 Reagent_Warning 数据')
    
    Reagent_Lot.objects.all().delete()
    print('已清空 Reagent_Lot 数据')

    
    # 最后删除主表
    Reagent_Template.objects.all().delete()
    print('已清空 Reagent_Template 数据')
    
    print('所有数据已清空')

if __name__ == '__main__':
    clear_all_data()