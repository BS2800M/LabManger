from django.http import JsonResponse
from Test_Manger.models import Kit_Info
import json
from django.db import transaction
from django.core.paginator import Paginator
from mylogin.views import checsession
import traceback


def Test_Kit_Action(request):
    if checsession(request) == 1:
        return JsonResponse({"status": 1, "msg": "非法请求"})
    else:
        request.userdata = checsession(request)
    
    if request.method == "GET":
        request.params = request.GET
    else:
        request.params = json.loads(request.body)
    action = request.params["action"]
    handler = KIT_HANDLERS.get(action)
    if handler:
        return handler(request)
    return JsonResponse({"status": "1", "msg": "不支持该类型操作"})


def add_Kit(request):
    try:
        with transaction.atomic():
            adddata = request.params["data"]
            adddata = Kit_Info.objects.create(name=adddata["name"],
                                        container=adddata["container"],
                                        sample_num=adddata["sample_num"],
                                        sample_type=adddata["sample_type"],
                                        result_time=adddata["result_time"],
                                        can_test=adddata["can_test"],
                                        price=adddata["price"],
                                        fasting=adddata["fasting"],
                                        team_id=adddata["team_id"],
                                        long_info=adddata["long_info"])
            return JsonResponse({"status": "0", "addid": adddata.id})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status": "1", "msg": "添加模板失败"})
    

def list_Kit(request):
    searchname = request.params["searchname"]
    pagenumber = request.params["pagenumber"]
    if searchname == "":
        listdata = Kit_Info.objects.filter(using=True).order_by("-id")
    else:
        listdata = Kit_Info.objects.filter(name__icontains=searchname, using=True).order_by("-id")
    paginator = Paginator(listdata, 13)
    page = paginator.get_page(pagenumber)
    if pagenumber == "all":
        listdata = list(listdata.values())
    else:
        listdata = list(page.object_list.values())
    return JsonResponse({"status": "0", "list": listdata, "total": paginator.count})

def modify_Kit(request):
    try:
        with transaction.atomic():
            updatedata = request.params["data"]
            updateid = request.params["id"]
            Kit_Info.objects.filter(id=updateid).update(name=updatedata["name"],
                                        container=updatedata["container"],
                                        sample_num=updatedata["sample_num"],
                                        sample_type=updatedata["sample_type"],
                                        result_time=updatedata["result_time"],
                                        can_test=updatedata["can_test"],
                                        price=updatedata["price"],
                                        fasting=updatedata["fasting"],
                                        team_id=updatedata["team_id"],
                                        long_info=updatedata["long_info"])
            return JsonResponse({"status": "0", "msg": "修改成功"})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status": "1", "msg": "修改失败"})
    
def del_Kit(request):
    try:
        with transaction.atomic():
            deleteid = request.params["id"]
            Kit_Info.objects.filter(id=deleteid).update(using=False)
            return JsonResponse({"status": "0", "msg": "删除成功"})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status": "1", "msg": "删除失败"})

KIT_HANDLERS = {
    "add_Kit": add_Kit,
    "list_Kit": list_Kit,
    "modify_Kit": modify_Kit,
    "del_Kit": del_Kit,
}


