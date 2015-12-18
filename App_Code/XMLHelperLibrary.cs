using System;
using System.Collections.Generic;
using System.Web;
/// <summary>
/// Class for building xml files from a sql database, and for formatting data as it comes in from the sql databases.
/// </summary>
namespace CustomHelpers {
public class XMLHelperLibrary
{
   public static String CreateXmlNode(string tag, string text) {
       return "<" + tag + ">" + text + "</" + tag +">";
   } 
}
}