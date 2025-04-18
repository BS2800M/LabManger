from django.db import models
from datetime import datetime,timedelta
from django.db import transaction
import traceback
# Create your models here.
class Reagent_Template(models.Model): #试剂模板表
    # 试剂名称
    name = models.CharField(max_length=100)
    # 试剂规格 箱 盒 
    specifications = models.CharField(max_length=20)
    #试剂设置的初始库存数量
    reagent_initnumber = models.IntegerField(default=0)
    #预警数量
    warn_number = models.IntegerField()
    #价格
    price = models.BigIntegerField()
    #创建时间
    creation_time=models.DateTimeField(auto_now=True)
    #试剂存放地点
    location=models.CharField(max_length=50)
    #试剂是否启用
    using=models.BooleanField(default=True)
    #预警天数
    warn_days=models.IntegerField(default=0)

class Reagent_Lot(models.Model): #试剂批号
    # 试剂绑定的试剂模板的id
    reagent =models.ForeignKey(Reagent_Template,on_delete=models.PROTECT)
    # 试剂批号
    lot = models.CharField(max_length=100)
    #创建时间
    creation_time=models.DateTimeField(auto_now=True)
    #试剂有效期
    Expiration_date=models.DateTimeField()
    #批号是否启用
    using=models.BooleanField(default=True)


class Reagent_Operation(models.Model):#试剂出入库操作记录
    # 出入库信息绑定的试剂模板id
    reagent =models.ForeignKey(Reagent_Template,on_delete=models.PROTECT)
    # 出入库信息绑定的试剂批号id
    lot=models.ForeignKey(Reagent_Lot,on_delete=models.PROTECT)
    #创建时间
    creation_time=models.DateTimeField(auto_now=True)
    #出入库动作
    operation_action=models.CharField(max_length=100)
    #出入库信息是否有效
    using=models.BooleanField(default=True)
    #出入库唯一条码标识
    barcodenumber=models.CharField(max_length=100,default="0")
    #出入库信息绑定的用户名称
    username = models.CharField(max_length=100,default="无用户")

    class Meta: 
        # 联合约束   条码 操作 试剂id 不能重复
        unique_together = ["barcodenumber", "operation_action","reagent","using"]
        # 联合索引  建立索引 提高查询效率
        index_together = ["barcodenumber", "operation_action","reagent","using"]
        index_together = ["reagent","lot","using"]

class Reagent_Warning(models.Model): #试剂和库存有关的信息
    # 预警信息绑定的试剂模板id
    reagent = models.OneToOneField(Reagent_Template,on_delete=models.CASCADE)
    #试剂现有数量
    reagent_number=models.IntegerField(default=0)
    #最后一次出库时间
    lasttime=models.DateTimeField(default=datetime.now)
    #预警时间
    warn_time=models.DateTimeField(default=datetime.now)
    #试剂上个月的出库数量
    lastmonth_outnumber=models.IntegerField(default=0)
    def cal_warn_time(self,*args,**kwargs): #计算预警时间
        timedetla=timedelta(days=self.reagent.warn_days)
        self.warn_time=self.lasttime+timedetla
        
    def numbercal(self,*args,**kwargs): #计算试剂数量
        outnumber=Reagent_Operation.objects.filter(using=True,reagent_id=self.reagent.id,operation_action="outbound").count()
        innumber=Reagent_Operation.objects.filter(using=True,reagent_id=self.reagent.id,operation_action="inbound").count()
        number=innumber-outnumber+self.reagent.reagent_initnumber
        self.reagent_number=number
    def lastmonth_outnumbercal(self,*args,**kwargs): #计算试剂上个月的出库数量
        lastmonth_outnumber=Reagent_Operation.objects.filter(using=True,reagent_id=self.reagent.id,operation_action="outbound",creation_time__month=datetime.now().month-1).count()
        self.lastmonth_outnumber=lastmonth_outnumber

