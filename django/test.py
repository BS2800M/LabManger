import os
import sys
import django
from django.conf import settings
from datetime import datetime, timedelta
import random
import uuid
from django.db import transaction

# 添加 Django 项目根目录到 Python 路径
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.append(project_root)

# 设置 Django 设置模块
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from Reagent_Manger.models import Reagent_Template, Reagent_Lot, Reagent_Operation, Reagent_Warning

# 试剂名称前缀和后缀
prefixes = ['硫酸', '盐酸', '硝酸', '氢氧化', '氯化', '碳酸', '磷酸', '醋酸', '草酸', '柠檬酸']
suffixes = ['钠', '钾', '钙', '镁', '铝', '铁', '铜', '锌', '铵', '氢']

def generate_random_reagent_name():
    prefix = random.choice(prefixes)
    suffix = random.choice(suffixes)
    return f"{prefix}{suffix}"

def generate_random_datetime():
    # 生成2025年1月1日到3月31日之间的随机时间
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 3, 31, 23, 59, 59)
    time_delta = end_date - start_date
    random_days = random.randint(0, time_delta.days)
    random_seconds = random.randint(0, 24 * 60 * 60 - 1)
    return start_date + timedelta(days=random_days, seconds=random_seconds)

def generate_test_data():
    print('开始生成测试数据...')
    
    try:
        # 生成试剂模板和预警信息
        print('生成试剂模板和预警信息...')
        for i in range(100):
            # 生成试剂模板
            template = Reagent_Template.objects.create(
                name=generate_random_reagent_name(),
                specifications=random.choice(['箱', '盒', '瓶']),
                reagent_initnumber=random.randint(100, 1000),
                warn_number=random.randint(10, 100),
                price=random.randint(100, 10000),
                location=random.choice(['实验室A', '实验室B', '仓库']),
                warn_days=random.randint(30, 180)
            )
            
            # 生成对应的预警信息
            warning = Reagent_Warning.objects.create(
                reagent=template,
                reagent_number=random.randint(0, template.reagent_initnumber),
                lasttime=datetime.now() - timedelta(days=random.randint(0, 365)),
                warn_time=datetime.now() + timedelta(days=random.randint(1, 365)),
                lastmonth_outnumber=random.randint(0, 50)
            )
            warning.cal_warn_time()  # 计算预警时间
            warning.save()
        
        # 生成批号
        print('生成批号...')
        for template in Reagent_Template.objects.all():
            # 每个试剂模板生成1-3个批号
            for _ in range(random.randint(1, 3)):
                Reagent_Lot.objects.create(
                    reagent=template,
                    lot=f'LOT{uuid.uuid4().hex[:8].upper()}',
                    Expiration_date=datetime.now() + timedelta(days=random.randint(30, 730))
                )
        
        # 生成出入库记录
        print('生成出入库记录...')
        lots = list(Reagent_Lot.objects.all())
        for _ in range(15000):
            with transaction.atomic():
                lot = random.choice(lots)
                operation_action = random.choice(['inbound', 'outbound'])
                random_time = generate_random_datetime()
                operation = Reagent_Operation.objects.create(
                    reagent=lot.reagent,
                    lot=lot,
                    operation_action=operation_action,
                    barcodenumber=f'BAR{uuid.uuid4().hex[:8].upper()}',
                    creation_time=random_time
                )
                
                # 更新预警信息
                warning = Reagent_Warning.objects.get(reagent=lot.reagent)
                warning.lasttime = operation.creation_time
                warning.numbercal()  # 重新计算库存数量
                warning.lastmonth_outnumbercal()  # 计算上个月出库数量
                warning.cal_warn_time()  # 重新计算预警时间
                warning.save()
        
        print('测试数据生成完成！')
        
    except Exception as e:
        print(f'生成测试数据时发生错误: {str(e)}')
        raise

if __name__ == '__main__':
    generate_test_data()
