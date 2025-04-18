import subprocess

module_action=0  # 0代表 开发模式  1 生产模式 2代表部署环境

def update_file(file_path,old_str,new_str):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)


if module_action==0:
    update_file('config/settings.py','DEBUG = False','DEBUG = True')
    result = subprocess.run(['python', './manage.py', 'runserver', '0.0.0.0:8000'])




if module_action==1:
    update_file('config/settings.py','DEBUG = True','DEBUG = False')
    result = subprocess.run(['waitress-serve','--port=8000','--threads=4','config.wsgi:application'])



if module_action==2:
    update_file('config/settings.py','DEBUG = False','DEBUG = True')
    result=subprocess.run(['pip', 'install', '-r', 'requirements.txt'])
    result = subprocess.run(['python', './manage.py', 'makemigrations'])
    result = subprocess.run(['python', './manage.py', 'migrate'])






