**NB**: The build scripts only work on Windows since they use JSBuilder.

# Sources #
  1. Install JSBuilder in "C:\Program Files\JS Builder" (download from http://www.jackslocum.com/build/download.php?dl=jsb)
  1. If JSBuilder is installed in a different directory, update the variable JSBUILDER\_BASE\_DIR into file build.bat
  1. Launch build.bat

# Documentation #
  1. Extracting archive jsdoc\_toolkit (http://jsdoc-toolkit.googlecode.com/files/jsdoc_toolkit-1.4.0.zip or newer)
  1. Make sure you have a JRE installed and configured in the path (eg by typing java from the command line)
  1. Edit "generaDoc.bat"  and change the value of JSDOC\_BASE\_DIR to the directory where you extracted jsdoc toolkit
  1. Launch generaDoc.bat

# Package #
  1. Ensure that you are able to generate the documentation following the instructions.
  1. Ensure that you are able to build the sources following the instructions.
  1. Download InfoZip's zip.exe ([ftp://ftp.info-zip.org/pub/infozip/win32/](ftp://ftp.info-zip.org/pub/infozip/win32/)) and install it in C:\Program Files\InfoZip
  1. If InfoZip is installed in a different directory, update the variable ZIP\_BASE\_DIR into generaDoc.bat
  1. Launch build\_all.bat