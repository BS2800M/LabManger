from django.http import JsonResponse
from Reagent_Manger.models import Reagent_Template,Reagent_Operation,Reagent_Warning
from datetime import datetime
import json
from django.db import transaction
from django.db.models import F
from django.core.paginator import Paginator
from mylogin.views import checsession
from django.db.models import Max
import traceback
from django.db import connections

from django.db.models.functions import Now  # 添加这行导入
from django.db.models.expressions import Value



def Reagent_Operation_Action(request):
    if checsession(request)==1:
        return JsonResponse({"status": 1, "msg": "非法请求"})
    else:
        request.userdata=checsession(request)
    if request.method == "GET":
        request.params = request.GET
    else:
        request.params = json.loads(request.body)
    action = request.params["action"]
    handler = OPERATION_HANDLERS.get(action)
    if handler:
        return handler(request)
    return JsonResponse({"status": "1", "msg": "不支持该类型操作"})



def inbound(request):
    with transaction.atomic():
        try:
            listdata=request.params["listdata"]
            addlist=[]
            for data in listdata:
                addnumber=data["number"]
                reagentid=data["reagentid"]
                lotid=data["lotid"]
                nextid=Reagent_Operation.objects.aggregate(Max('id'))
                nextid=nextid['id__max']
                if nextid==None:
                    nextid=-1
                nextid=nextid+1
                addid=nextid
                for data in range(0,addnumber,1):
                    add=Reagent_Operation(reagent_id=reagentid,
                                    lot_id=lotid,
                                    operation_action="inbound",
                                    using=True,
                                    username=request.userdata['username'],
                                    barcodenumber=addid+1000000000
                                    )
                    addid=addid+1
                    addlist.append(add)
            Reagent_Operation.objects.bulk_create(addlist)
            resultlist=Reagent_Operation.objects.filter(id__gte=nextid)
            resultlist=resultlist.values("reagent__name","lot__lot","lot__Expiration_date","barcodenumber")
            resultlist=list(resultlist)
            for data in listdata:
                modify=Reagent_Warning.objects.get(reagent_id=data["reagentid"])
                modify.numbercal() #计算试剂数量
                modify.save()
            return JsonResponse({"status": 0, "list":resultlist})
        except Exception:
            traceback.print_exc()
            return JsonResponse({"status":"1","msg":"入库失败"})






def list_operation(request):
    listname=request.params["searchname_operation"]
    search_later=request.params["searchlater_operation"]
    search_earlier=request.params["searchearlier_operation"]
    pagenumber=request.params["pagenumber"]
    barcodenumber=request.params["barcodenumber"]
    try:
        # 构建基础查询条件
        query = Reagent_Operation.objects.filter(using=True, creation_time__range=(search_later,search_earlier))
        query=query.select_related("reagent","lot")
        # 如果 listname 不为空，添加试剂名称的过滤条件
        if listname:
            query = query.filter(reagent__name__icontains=listname)
        if barcodenumber:
            query = query.filter(barcodenumber__icontains=barcodenumber)
        # 按创建时间倒序排序
        listdata = query.order_by("-creation_time")
        paginator=Paginator(listdata,13)
        page=paginator.get_page(pagenumber)
        #按照指定页码查找
        if pagenumber=="all":
            listdata=list(listdata.values("id","reagent__name","lot__lot","creation_time","operation_action","barcodenumber","username"))
        else:
            listdata=list(page.object_list.values("id","reagent__name","lot__lot","creation_time","operation_action","barcodenumber","username"))

        return JsonResponse({"status":"0","list":listdata,"total_pages":paginator.num_pages,"current_page":page.number})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status":"1","msg":"搜索失败"})



def outbound(request):
    with transaction.atomic():
        mybarcodenum=request.params["barcodenumber"]
        try:
            search=Reagent_Operation.objects.filter(using=True,barcodenumber=mybarcodenum)
            count=search.count()      
            if count==0:
                return JsonResponse({"status":"0","msg":"该试剂未入库"})
            if count>1:
                return JsonResponse({"status":"0","msg":"该试剂已出库"})
            if count==1:
                search=search.first()
                adddata = Reagent_Operation.objects.create(reagent_id=search.reagent_id,
                                lot_id=search.lot_id ,
                                operation_action="outbound",
                                using=True,
                                barcodenumber=search.barcodenumber,
                                username=request.userdata['username']
                                )
                modify = Reagent_Warning.objects.get(reagent_id=search.reagent_id) 
                modify.numbercal() #计算试剂数量
                modify.cal_warn_time()#更新预警时间
                modify.lastmonth_outnumbercal() #计算试剂上个月的出库数量
                modify.save()
                reagentname=adddata.reagent.name
                message=mybarcodenum+reagentname+"出库成功"
                newlot=Reagent_Operation.objects.filter(using=True,reagent_id=search.reagent_id,lot_id=search.lot_id,operation_action="outbound").count()
                if newlot==1:   
                    message=message+"该试剂为新批号"
                if modify.reagent_number<=modify.reagent.warn_number:
                    message=message+f"警告,该试剂剩余数量：{modify.reagent_number}"
                return JsonResponse({"status":"0","msg":message})
        except Exception:
            traceback.print_exc()
            return JsonResponse({"status":"1","msg":"操作失败"})


def special_outbound(request):
    with transaction.atomic():
        try:
            outnumber=request.params["outnumber"]
            outnumber=int(outnumber)
            outreagentid=request.params["outreagentid"]
            outlotid=request.params["outlotid"]
            count=Reagent_Warning.objects.get(reagent_id=outreagentid)
            count=count.reagent_number
            if count<outnumber:
                return JsonResponse({"status":"1","msg":"出库失败，库存量不足"})
            else:
                addlist=[]
                for i in range(0,outnumber):
                    add = Reagent_Operation(reagent_id=outreagentid,
                        lot_id=outlotid ,
                        operation_action="s_outbound",
                        using=True,
                        barcodenumber=-1,
                        username=request.userdata['username']
                        )
                    addlist.append(add)
                print(addlist)
                Reagent_Operation.objects.bulk_create(addlist)
                modify=Reagent_Warning.objects.select_related('reagent').get(reagent_id=outreagentid)
                modify.numbercal()
                modify.cal_warn_time()#更新预警时间
                modify.lastmonth_outnumbercal() #计算试剂上个月的出库数量
                modify.save()
                return JsonResponse({"status":"0","msg":modify.reagent.name+"出库成功"})
        except:
            traceback.print_exc()
            return JsonResponse({"status":"1","msg":"操作失败"})


def delete_operation(request):
    deleteid=request.params["id"]
    try:
        with transaction.atomic():
            delete=Reagent_Operation.objects.get(id=deleteid)
            delete.using=False
            delete.save()
            deleteregent_id=delete.reagent #获取该操作记录的试剂id
            delete=Reagent_Warning.objects.get(reagent=deleteregent_id) #获取对象
            delete.numbercal()#修正库存
            delete.save()
            return JsonResponse({"status":"0","id":deleteid})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status":"1","msg":"删除失败"})

def list_reagentnumber(request):
    only_showwarn=request.params["only_showwarn"]
    nowtime=datetime.now()
    pagenumber=request.params["pagenumber"]
    listdata = Reagent_Warning.objects.select_related('reagent') #select_related减少查询次数
    if only_showwarn=="true":
        listdata=listdata.filter(reagent_number__lte=F('reagent__warn_number'),warn_time__lte=nowtime,reagent__using=True).order_by("-lasttime")
    if only_showwarn=="false":
        listdata=listdata.filter(reagent__using=True).order_by("-lasttime")
    listdata=list(listdata.values("reagent__name","reagent__specifications","reagent_number","reagent__warn_number","reagent__warn_days","lastmonth_outnumber","lasttime"))
    warn_typenum=len(listdata) #提示有多少种试剂缺少
    paginator=Paginator(listdata,13)
    page=paginator.get_page(pagenumber)
    if pagenumber=="all": #pagenumber为all时  导出所有试剂的信息 
        listdata=listdata
    else:
        listdata=list(page.object_list)
    return JsonResponse({"status":"0","list":listdata,"total_pages":paginator.num_pages,"current_page":page.number,"warn_typenum":warn_typenum})


def refresh_reagent(request):#更新所有试剂信息（需要计算的）    
    try:
        with transaction.atomic():
            list=Reagent_Template.objects.filter(using=True)
            for data in list:
                modify=Reagent_Warning.objects.get(reagent_id=data.id)
                modify.numbercal()
                modify.cal_warn_time(updatetime=False)
                modify.lastmonth_outnumbercal()
                modify.save()
            return JsonResponse({"status":"0"})
    except Exception:
        traceback.print_exc()
        return JsonResponse({"status":"1","msg":"试剂数量修正错误"})


# 首先定义一个操作映射字典
OPERATION_HANDLERS = {
    "inbound": inbound,
    "list_operation": list_operation,
    "outbound": outbound,
    "special_outbound":special_outbound,
    "delete_operation": delete_operation,
    "list_reagentnumber": list_reagentnumber,
    "refresh_reagent": refresh_reagent
}