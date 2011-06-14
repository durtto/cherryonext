set JSDOC_BASE_DIR=Z:\test\WEB\netbox_alarmbrowser_dev\jsdoc_toolkit-1.4.0
java -Djsdoc.dir=%JSDOC_BASE_DIR% -jar %JSDOC_BASE_DIR%\app\js.jar %JSDOC_BASE_DIR%\app\run.js -r=5 -d="%~dp0doc" -t=%JSDOC_BASE_DIR%\templates\sunny -a -p "%~dp0src"
