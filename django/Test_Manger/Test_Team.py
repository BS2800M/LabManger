from django.http import JsonResponse
from Test_Manger.models import Test_Team, Kit_Info, Test_Info
import json
from django.db import transaction
from django.core.paginator import Paginator
from mylogin.views import checsession
import traceback


def Test_Team_Action(request):
    if checsession(request)==1:
        return JsonResponse({"status": 1, "msg": "非法请求"})
    else:
        request.userdata=checsession(request)
    if request.method == "GET":
        request.params = request.GET
    else:
        request.params = json.loads(request.body)
    action = request.params["action"]
    handler = TEAM_HANDLERS.get(action)
    if handler:
        return handler(request)
    return JsonResponse({"status": "1", "msg": "不支持该类型操作"})

def add_Team(request):
    try:
        with transaction.atomic():
            adddata=request.params["data"]
            adddata = Test_Team.objects.create(name=adddata["name"] ,
                                    phone=adddata["phone"] ,
                                    long_info=adddata["long_info"],
                                    )
            return JsonResponse({"status": "0", "addid":adddata.id})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status": "1", "msg": "添加模板失败"})
def list_Team(request):
    searchname=request.params["searchname"]
    pagenumber=request.params["pagenumber"]
    if searchname=="":
        listdata=Test_Team.objects.filter(using=True).order_by("-id")
    else:
        listdata=Test_Team.objects.filter(name__icontains=searchname,using=True).order_by("-id")
    paginator=Paginator(listdata,13)
    page=paginator.get_page(pagenumber)
    if pagenumber=="all":
        listdata=list(listdata.values())
    else:
        listdata=list(page.object_list.values())
    return JsonResponse({"status": "0", "list":listdata,"total_pages":paginator.num_pages,"current_page":page.number})
def modify_Team(request):   
    try:
        with transaction.atomic():
            updatedata=request.params["data"]
            updateid=request.params["id"]
            Test_Team.objects.filter(id=updateid).update(name=updatedata["name"],
                                        phone=updatedata["phone"],
                                        long_info=updatedata["long_info"])
            return JsonResponse({"status": "0", "msg":"修改成功"})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status": "1", "msg": "修改失败"})
def del_Team(request):
    try:
        with transaction.atomic():
            deleteid=request.params["id"]
            Test_Team.objects.filter(id=deleteid).update(using=False)
            Kit_Info.objects.filter(team_id=deleteid).update(using=False)
            Test_Info.objects.filter(kit_name__team_id=deleteid).update(using=False)
            return JsonResponse({"status": "0", "msg":"删除成功"})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status": "1", "msg": "删除失败"})

def list_ALLTeam(request):
    listdata=Test_Team.objects.filter(using=True).order_by("-id")
    listdata=list(listdata.values("id","name"))
    return JsonResponse({"status": "0", "list":listdata})

TEAM_HANDLERS = {
    "add_Team": add_Team,
    "list_Team": list_Team,
    "modify_Team": modify_Team,
    "del_Team": del_Team,
    "list_ALLTeam": list_ALLTeam,
}
