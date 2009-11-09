var logF = log4javascript.getLogger(); 
// Create a PopUpAppender with default options
var popUpAppender = new log4javascript.PopUpAppender(true);
popUpAppender.setComplainAboutPopUpBlocking(true);
popUpAppender.setReopenWhenClosed(true);
  // Add the appender to the logger
logF.addAppender(popUpAppender);
