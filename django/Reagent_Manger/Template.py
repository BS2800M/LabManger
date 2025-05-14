
from django.http import JsonResponse
from Reagent_Manger.models import Reagent_Template,Reagent_Warning,Reagent_Lot
import json
from django.db import transaction
from django.core.paginator import Paginator
from mylogin.views import checsession
import traceback


from django.core.cache import cache
from django.db.models import QuerySet

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
    cache.delete("template_list")
    cache.delete("template_page")
    try:
        with transaction.atomic():
            adddata=request.params["data"]
            adddata = Reagent_Template.objects.create(name=adddata["name"] ,
                                    specifications=adddata["specifications"] ,
                                    reagent_initnumber=adddata["reagent_initnumber"],
                                    warn_number=adddata["warn_number"],
                                    price=adddata["price"],
                                    location=adddata["location"],
                                    warn_days=adddata["warn_days"],
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

    if searchname=="" and pagenumber=="1" and cache.get("template_list")!=None and cache.get("template_page")!=None:
        return JsonResponse({"status":"0","list":cache.get("template_list"),"total_pages":cache.get("template_page"),"current_page":"1"})


    listdata=Reagent_Template.objects.filter(using=True).order_by("-creation_time")
    if searchname!="":
        listdata=listdata.filter(name__icontains=searchname)
    if pagenumber=="all":
        listdata=list(listdata.values())
    else:
        paginator=Paginator(listdata,13)
        page=paginator.get_page(pagenumber)
        listdata=list(page.object_list.values())
    
    if searchname=="" and pagenumber=="1":
        cache.set("template_list",listdata,60)
        cache.set("template_page",paginator.num_pages,60)
    return JsonResponse({"status":"0","list":listdata,"total_pages":paginator.num_pages,"current_page":page.number})

    
def modify_Template(request):
    cache.delete("template_list")
    cache.delete("template_page")
    try:
        with transaction.atomic():
            modifyid=request.params["id"]
            modifydata=request.params["data"]
            modify = Reagent_Template.objects.get(id=modifyid)
            modify.name=modifydata["name"]
            modify.specifications=modifydata["specifications"]
            modify.reagent_initnumber=modifydata["reagent_initnumber"]
            modify.warn_number=modifydata["warn_number"]
            modify.price=modifydata["price"]
            modify.location=modifydata["location"]
            modify.warn_days=modifydata["warn_days"]
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
    

def list_AllTemplate(request): #用来显示全部试剂 不需要任何页码数
    listdata=Reagent_Template.objects.filter(using=True)
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

