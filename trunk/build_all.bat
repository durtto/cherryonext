CALL build.bat
CALL generaDoc.bat
set ZIP_HOME="C:\Program Files\InfoZip"
"cd /d %~dp0"
%ZIP_HOME%\zip -r CherryOnExt.zip src resources doc demo cherryonext.js cherryonext-debug.js -x demo\.svn -x resources\.svn -x src\.svn  -x doc\.svn -x "*/.*