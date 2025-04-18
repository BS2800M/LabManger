
add_template={
"action":"add_Template", #增加试剂模板
"data":{
    "name":"anti5" ,        #名字
    "specifications":"箱",     #试剂规格 箱 盒
    "reagent_initnumber":"10",      #试剂初始库存数量
    "warn_number":"2",              #预警数量
    "price":"150",               #价格
    "location":"总院"         #试剂存放地点
        }
}

list_template={
"action":"list_Template",     #列出所有试剂模板
"pagenumber":"1",     #指定的页码
"searchname":"",   #查询的试剂名字
}

modify_temple={
"action":"modify_Template", #修改模板
"id":"17",
"data":{
    "name":"超级产业" ,        #名字
    "specifications":"盒",     #试剂规格 箱 盒
    "reagent_initnumber":"10",      #试剂初始库存数量
    "warn_number":"2",              #预警数量
    "price":"158",               #价格
    "location":"总院"         #试剂存放地点
        }

}


delete_temple={       #删除试剂模板
"action":"del_Template",
"id":"18"
}

list_aLLtemplate={        #列出所有可用的试剂模板
"action":"list_AllTemplate",     
}



add_lot={      
"action":"add_Lot",   #添加批号
"data":{                  
    "reagentid":"10",   #绑定的试剂模板id
    "lot":"1520" ,        #批号
    "Expiration_date":"2025-01-12T18:04:40.297" #有效期
        }
}

list_lot={ #列出所有有效的批号
"action":"list_Lot",     
"searchname":"", #查询的批号
"pagenumber":"1" #指定页码
}



modify_lot={  #修改批号信息
"action":"modify_Lot",
"id":"1", #批号的id
"data":{
    "reagentid":"11" ,        #试剂id绑定
    "lot":"2005",     #试剂批号
    "Expiration_date":"2025-01-12T18:04:40.297",              #有效期
        }
}


delete_lot={  #删除试剂批号
    "action":"del_Lot",
    "id":"1"

}


list_AllLot={     #指定某个试剂 列出其所有的批号
"action":"list_AllLot",     
"search_reagentid":"16",
}


inoutbound={  #入库
"action":"inbound",
"listdata":[
    {
    "number":3,  #入库试剂数量
    "reagentid":"92" ,        #试剂id绑定
    "lotid":"13"   #试剂批号
        } ,
    { "number":10,  
    "reagentid":"93" ,       
    "lotid":"13" 
    }
    ]  
}


list_operation={          #列出所有世界操作 包括入库出库
"action":"list_operation",     
"searchname_operation":"5", # 搜索的试剂名称
"searchlater_operation":"2025-01-13 21:35:37.376772", #搜索的试剂时间 从什么时间开始
"searchearlier_operation":"2025-01-13 21:35:37.376772", #搜索的试剂时间 从什么时间结束
"pagenumber":"1" #指定页码
}

fast_bound={ #出库
"action":"outbound",  
"barcodenumber":"yapei2157250117" #条码号
}



signin={            #登录
"username":"mypc",     
"password":"10086",
}

signout={} #登出


