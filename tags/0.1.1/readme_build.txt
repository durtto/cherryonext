To build the sources:
1. Install JSBuilder in "C:\Programs\JS Builder" (download from http://www.jackslocum.com/build/download.php?dl=jsb)
2. If JSBuilder is installed in a different directory, update the variable JSBuilder_dir into file build.bat

To generate documentation:
1. Extracting archive jsdoc_toolkit (http://jsdoc-toolkit.googlecode.com/files/jsdoc_toolkit-1.4.0.zip or newer)
2. Make sure you have a JRE installed and configured in the path (eg by typing java from the command line)
3. Change the file "generaDoc.bat" to the first line by specifying the directory where it is jsdoc_toolkit

To zip the package:
1. Download zip.exe (ftp://ftp.info-zip.org/pub/infozip/win32/)
2. Make sure you have configured in the path (eg by typing zip from the command line)
3. Launch build_all.bat
