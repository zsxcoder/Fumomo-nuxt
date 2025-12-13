@echo off
echo RSS 诊断工具
echo ===============
echo.
echo 1. 验证当前配置的RSS源
echo 2. 测试多个RSS源响应速度
echo 3. 退出
echo.
set /p choice=请选择操作 (1-3): 

if "%choice%"=="1" (
  echo.
  echo 正在验证当前配置的RSS源...
  node -e "import('./scripts/validate-rss.js').then(m => m.main())"
) else if "%choice%"=="2" (
  echo.
  echo 正在测试多个RSS源响应速度...
  node -e "import('./scripts/test-rss.js').then(m => m.testAllRSSSources())"
) else if "%choice%"=="3" (
  exit /b 0
) else (
  echo 无效选择，请重新运行脚本
)
echo.
pause