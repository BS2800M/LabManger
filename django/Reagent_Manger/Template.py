
from django.http import JsonResponse
from Reagent_Manger.models import Reagent_Template,Reagent_Warning,Reagent_Lot
from Test_Manger.models import Test_Team
import json
from django.db import transaction
from django.core.paginator import Paginator
from mylogin.views import checsession
import traceback
from django.core.cache import cache

def Reagent_Template_Action(request):
    if checsession(request)==1:
        return JsonResponse({"status": 1, "msg": "非法请求"})
    else:
        request.userdata=checsession(request)
    if request.method == "GET":
        request.params = request.GET
    else:
        request.params = json.loads(request.body)
    action = request.params["action"]
    handler = TEMPLATE_HANDLERS.get(action)
    if handler:
        return handler(request)
    return JsonResponse({"status": "1", "msg": "不支持该类型操作"})

def add_Template(request):
    try:
        with transaction.atomic():
            adddata=request.params["data"]
            addteam=Test_Team.objects.get(id=adddata["team"]) #先获取 team对象
            adddata = Reagent_Template.objects.create(name=adddata["name"] ,
                                    specifications=adddata["specifications"] ,
                                    reagent_initnumber=adddata["reagent_initnumber"],
                                    warn_number=adddata["warn_number"],
                                    price=adddata["price"],
                                    location=adddata["location"],
                                    warn_days=adddata["warn_days"],
                                    team=addteam,
                                    using=1)
            Reagent_Warning.objects.create(reagent=adddata) #同步更新库存表
            generate_lot=request.params["data"]["is_generate_lot"] 
            if generate_lot==True: #如果选择了创建默认批号 则创建一个批号
                Reagent_Lot.objects.create(reagent_id=adddata.id,
                                           lot="默认"+str(adddata.name)+"批号",
                                           Expiration_date="2050-1-1",
                                           using=True)
                
            return JsonResponse({"status": "0", "addid":adddata.id})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status": "1", "msg": "添加模板失败"})
    
def list_Template(request):
    searchname=request.params["searchname"]
    pagenumber=request.params["pagenumber"]
    searchteam=request.params["searchteam"]
    listdata=Reagent_Template.objects.filter(using=True).select_related("team").order_by("-creation_time")
    if searchname!="":
        listdata=listdata.filter(name__icontains=searchname)
    if searchteam!="":
        listdata=listdata.filter(team=searchteam)
    paginator=Paginator(listdata,13)
    page=paginator.get_page(pagenumber)
    if pagenumber!="all":
        listdata=page.object_list
    listdata=list(listdata.values("id","name","specifications","reagent_initnumber","warn_number","price","creation_time","location","team_id","team__name","warn_days"))
    
    return JsonResponse({"status":"0","list":listdata,"total_pages":paginator.num_pages,"current_page":page.number})

    
def modify_Template(request):
    try:
        with transaction.atomic():
            modifyid=request.params["id"]
            modifydata=request.params["data"]
            print(modifydata)
            modifyteam=Test_Team.objects.get(id=modifydata["team"]) #先获取 team对象
            modify = Reagent_Template.objects.get(id=modifyid)
            modify.name=modifydata["name"]
            modify.specifications=modifydata["specifications"]
            modify.reagent_initnumber=modifydata["reagent_initnumber"]
            modify.warn_number=modifydata["warn_number"]
            modify.price=modifydata["price"]
            modify.location=modifydata["location"]
            modify.warn_days=modifydata["warn_days"]
            modify.team=modifyteam
            modify.save()
            modify=Reagent_Warning.objects.get(reagent_id=modifyid)
            modify.cal_warn_time()
            modify.save() 
            return JsonResponse({"status":"0","id":modifyid})
    except Exception :
        traceback.print_exc()
        return JsonResponse({"status":"1", "msg": "修改模板失败"})

def del_Template(request):
    try:
        cache.clear()
        with transaction.atomic():
            deleteid=request.params["id"]
            delete = Reagent_Template.objects.get(id=deleteid)
            delete.using=False
            delete.save()
            return JsonResponse({"status": "0","id":deleteid})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status":"1", "msg": "修改删除失败"})
    

def list_AllTemplate(request): #用来显示本小组的全部试剂 不需要任何页码数
    searchteam=request.params["searchteam"]
    listdata=Reagent_Template.objects.filter(using=True,team=searchteam)
    listdata=listdata.order_by("id")
    listdata=list(listdata.values("id","name","location"))
    return JsonResponse({"status":"0","list":listdata})



TEMPLATE_HANDLERS = {
    "add_Template": add_Template,
    "list_Template": list_Template,
    "modify_Template": modify_Template,
    "del_Template": del_Template,
    "list_AllTemplate": list_AllTemplate
}

