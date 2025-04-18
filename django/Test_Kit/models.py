# from django.db import models
# import datetime

# class Test_Team(models.Model):
#     #检验小组名字
#     name=models.CharField(max_length=100,default="未知")
#     #联系电话
#     phone=models.CharField(max_length=100,default="未知")



# class Kit_Info(models.Model):
#     #组套名称
#     name = models.CharField(max_length=100,default="未知")
#     #组套采集容器
#     container = models.CharField(max_length=50,default="未知")
#     #标本采集量
#     sample_num=models.CharField(max_length=100,default="未知")
#     #标本类型
#     sample_type=models.CharField(max_length=100,default="未知")
#     #组套出结果时间
#     result_name=models.CharField(default=datetime.datetime.now,max_length=100)
#     #组套是否启用
#     using=models.BooleanField(default=True)
#     #组套实际是否可以检验
#     can_test=models.CharField(max_length=50,default="可以检验")
#     #组套价格
#     price=models.IntegerField(default=0)
#     #是否需要空腹
#     fasting=models.CharField(max_length=50,default="未知")
#     #属于哪个检验小组
#     team=models.ForeignKey(Test_Team,on_delete=models.CASCADE)
#     #其他注意事项
#     long_info=models.TextField(default="未知")



# class Test_Info(models.Model):
#     #测试项目名字
#     name=models.CharField(max_length=100,default="未知")
#     #测试项目价格
#     price=models.IntegerField(default=0)
#     #测试项目所属的组套
#     kit_name=models.ForeignKey(Kit_Info,on_delete=models.CASCADE)
#     #测试项目是否启用
#     using=models.BooleanField(default=True)




