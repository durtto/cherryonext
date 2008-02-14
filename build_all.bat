CALL build.bat
CALL generaDoc.bat
zip -r CherryOnExt.zip src resources doc cherryonext.js cherryonext-debug.js test\simulateAjaxCall.js test\jsunit\lib\jsUnitAjax.js test\test1.htm test\test2.htm test\provaInputTextMask.htm -x doc\.svn -x "*/.*