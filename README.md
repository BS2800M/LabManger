# 依赖安装
    cd ./django
    pip install -r requirements.txt
    python ./run.py --mode=2
    cd .. 
    cd./vue-project
    npm install

# 生成win32 electron
    npm run build
    npm run build-electron-win
# 运行后端
    cd ./django
    python ./run.py --mode=1

