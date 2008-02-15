CALL build.bat
CALL generaDoc.bat
set ZIP_BASE_DIR="C:\Program Files\InfoZip"
"cd /d %~dp0"
%ZIP_BASE_DIR%\zip -r CherryOnExt.zip src resources doc demo cherryonext.js cherryonext-debug.js -x demo\.svn -x resources\.svn -x src\.svn  -x doc\.svn -x "*/.*