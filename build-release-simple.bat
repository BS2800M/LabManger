@echo off
echo ========================================
echo Lab Manager - Auto Build Script
echo ========================================
echo.

echo [1/4] Cleaning old build files...
if exist "electron-vite\dist" rmdir /s /q "electron-vite\dist"
if exist "LabMangerAPI\LabMangerAPI\publish" rmdir /s /q "LabMangerAPI\LabMangerAPI\publish"
if exist "release" rmdir /s /q "release"
echo Cleanup completed!
echo.

echo [2/4] Building frontend Electron app...
cd electron-vite
call npm run build:win
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)
echo Frontend build completed!
echo.

echo [3/4] Building backend API with self-contained .NET...
cd ..\LabMangerAPI\LabMangerAPI
call dotnet publish --configuration Release --output ./publish --self-contained true --runtime win-x86
if %errorlevel% neq 0 (
    echo Backend build failed!
    pause
    exit /b 1
)
echo Backend build completed!
echo.

echo [4/4] Organizing release files...
cd ..\..
mkdir release
mkdir release\frontend
mkdir release\backend

echo Copying frontend files...
if exist "electron-vite\dist\win-ia32-unpacked" (
    xcopy "electron-vite\dist\win-ia32-unpacked\*" "release\frontend\" /e /i /y
) else if exist "electron-vite\dist\win-ia32" (
    xcopy "electron-vite\dist\win-ia32\*" "release\frontend\" /e /i /y
) else (
    echo Warning: Frontend build directory not found
)

echo Copying backend files...
xcopy "LabMangerAPI\LabMangerAPI\publish\*" "release\backend\" /e /i /y

echo Creating startup scripts...
(
echo @echo off
echo echo Starting Lab Manager Frontend...
echo cd /d "%%~dp0frontend"
echo start labmanger.exe
) > "release\start-frontend.bat"

(
echo @echo off
echo echo Starting Lab Manager Backend API...
echo cd /d "%%~dp0backend"
echo LabMangerAPI.exe
) > "release\start-backend.bat"

echo Creating README...
(
echo # Lab Manager Release Package
echo.
echo ## Directory Structure
echo - frontend/ - Frontend application files
echo - backend/ - Backend API files
echo.
echo ## Startup Instructions
echo 1. Double-click start-backend.bat to start the backend API
echo 2. Double-click start-frontend.bat to start the frontend application
echo.
echo ## Notes
echo - .NET 9.0 Runtime is included (self-contained)
echo - Backend API runs on http://localhost:8000
echo - Database will be automatically initialized on first run
echo - No additional .NET installation required
echo - SQLite database file will be created automatically
) > "release\README.md"

echo.
echo ========================================
echo Build completed! Files organized in release directory
echo ========================================
echo.
echo Directory structure:
echo release\
echo ├── frontend          - Frontend app
echo ├── backend           - Backend API
echo ├── start-frontend.bat - Start frontend
echo ├── start-backend.bat  - Start backend
echo └── README.md          - Instructions
echo.
echo Please check the release directory
pause
