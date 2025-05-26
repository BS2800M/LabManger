from django.shortcuts import render
from django.http import JsonResponse
from Reagent_Manger.models import Reagent_Lot,Reagent_Template
import json
from django.db import transaction
from django.core.paginator import Paginator
from mylogin.views import checsession
import traceback


def Reagent_Lot_Action(request):
    if checsession(request)==1:
        return JsonResponse({"status": 1, "msg": "非法请求"})
    else:
        request.userdata=checsession(request)
    if request.method == "GET":
        request.params = request.GET
    else:
        request.params = json.loads(request.body)
    action = request.params["action"]
    handler = LOT_HANDLERS.get(action)
    if handler:
        return handler(request)
    return JsonResponse({"status": "1", "msg": "不支持该类型操作"})
    


def add_Lot(request):
    try:
        with transaction.atomic():
            adddata=request.params["data"]
            adddata = Reagent_Lot.objects.create(reagent_id=adddata["reagentid"] ,
                                lot=adddata["lot"] ,
                                Expiration_date=adddata["Expiration_date"],
                                using=True)
            return JsonResponse({"status":"0", "addid":adddata.id})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status":"1","msg":"批号添加失败"}) 


def list_Lot(request):
    searchname=request.params["searchname"]
    pagenumber=request.params["pagenumber"]
    searchteam=request.params["searchteam"]
    listdata=Reagent_Lot.objects.filter(using=True).select_related('reagent',"team").order_by("-creation_time")
    if searchname!="":
        listdata=listdata.filter(reagent__name__icontains=searchname)
    if searchteam!="":
        listdata=listdata.filter(reagent__team=searchteam)
    paginator=Paginator(listdata,13)
    page=paginator.get_page(pagenumber)
    if pagenumber!="all":
        listdata=page.object_list
    listdata=list(listdata.values("id","lot","reagent_id","Expiration_date","creation_time","reagent__name"))
    return JsonResponse({"status":"0","list":listdata,"total_pages":paginator.num_pages,"current_page":page.number})




def modify_Lot(request):
    try:
        with transaction.atomic():
            modifyid=request.params["id"]
            modifydata=request.params["data"]
            modify = Reagent_Lot.objects.get(id=modifyid) #判断修改的批号存不存在
            if "reagentid" in modifydata:
                modify.reagent_id=modifydata["reagentid"]
            if "lot" in modifydata:
                modify.lot=modifydata["lot"]
            if "Expiration_date" in modifydata:
                modify.Expiration_date=modifydata["Expiration_date"]
            modify.save()
            return JsonResponse({"status":"0","id":modifyid})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status":"1","msg":"批号修改失败"}) 





def del_Lot(request):
    try:
        with transaction.atomic():
            deleteid=request.params["id"]
            delete = Reagent_Lot.objects.get(id=deleteid)
            delete.using=False
            delete.save()
            return JsonResponse({"status":"0","id":deleteid})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status":"1","msg":"批号删除失败"}) 


def list_AllLot(request): #用来显示指定试剂id的所有批号 不需要任何页码数 非模糊搜索
    search_reagentid=request.params["search_reagentid"]
    listdata=Reagent_Lot.objects.filter(reagent_id=search_reagentid,using=True).order_by("-creation_time")
    listdata=list(listdata.values("id","lot"))
    return JsonResponse({"status":"0","list":listdata})

LOT_HANDLERS = {
    "add_Lot": add_Lot,
    "list_Lot": list_Lot,
    "modify_Lot": modify_Lot,
    "del_Lot": del_Lot,
    "list_AllLot": list_AllLot
}
