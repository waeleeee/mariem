@echo off
echo PostgreSQL Connection Test
echo =========================
echo.

echo Step 1: Checking PostgreSQL installation...
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "SELECT version();" 
if %ERRORLEVEL% EQU 0 (
  echo PostgreSQL is installed and running!
) else (
  echo Failed to connect to PostgreSQL.
  exit /b 1
)

echo.
echo Step 2: Checking if database 'radio_sales' exists...
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "SELECT datname FROM pg_database WHERE datname = 'radio_sales';"
echo.

echo Step 3: Checking tables in 'radio_sales' database...
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d radio_sales -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
echo.

echo PostgreSQL diagnostic test completed successfully!
echo You can now run your application with 'npm start' 