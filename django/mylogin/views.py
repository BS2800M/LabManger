from django.http import JsonResponse
import json
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
import jwt
from datetime import datetime
from mylogin.models import tokentable


screct_key="labmanger10086"

#创建token
def token_create(userid,username,usertype): 
    encoderdata=jwt.encode({"userid":userid,"username":username,"usertype":usertype,"createtime":str(datetime.now())},screct_key,algorithm='HS256')
    tokentable.objects.create(mytoken=encoderdata)#储存token
    return encoderdata

# 登录处理
def signin( request):
    # 从 HTTP POST 请求中获取用户名、密码参数
    request.params = json.loads(request.body)
    userName = request.params["username"]
    passWord = request.params["password"]
    # 使用 Django auth 库里面的 方法校验用户名、密码
    user = authenticate(username=userName, password=passWord)

    # 如果能找到用户，并且密码正确
    if user is not None:
        if user.is_active:
            if user.is_superuser:
                login(request, user)
                return JsonResponse({'status': 0,'msg':'登录成功',"username":userName,"token":token_create(user.id,userName,"admin")})
            else:
                return JsonResponse({'status': 0, 'msg': '请使用管理员账户登录'})
        else:
            return JsonResponse({'status': 0, 'msg': '用户已经被禁用'})
    # 否则就是用户名、密码有误
    else:
        return JsonResponse({'status': 1, 'msg': '用户名或者密码错误'})


# 登出处理
def signout( request):
    request_token=request.META['HTTP_TOKEN']
    tokentable.objects.get(mytoken=request_token).delete()
    return JsonResponse({'ret': 0,'msg':'成功登录退出'})

#检查session,并将用户名称和类型放入parmas
def checsession(request):
    if 'HTTP_TOKEN' not in request.META.keys():
        return 1
    request_token=request.META['HTTP_TOKEN']
    tokensearch=tokentable.objects.filter(mytoken=request_token).exists()
    if tokensearch==False:
        return 1
    request_token=jwt.decode(request_token,screct_key,algorithms='HS256')
    session={}
    session['username']  =request_token['username']
    session['usertype']  =request_token['usertype']
    session['userid']  = request_token['userid']
    return session