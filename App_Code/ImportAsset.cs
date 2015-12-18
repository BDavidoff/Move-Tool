using System;
using System.Collections.Generic;
using System.Web;
using Microsoft.Web.Helpers;

/// <summary>
/// Summary description for ImportAsset
/// </summary>
namespace CustomHelpers {
public class ImportAsset
{
    public List<string[]> Moves = new List<string[]>();
	public long           moveListID;
	public int            creator;
	public string         movers; 
	public string         moveName;
	public DateTime       moveDate;
	public string         moveLocation;
	public string         fullFilePath;
	public DateTime       createdDate;
	
	public ImportAsset(string filePath) {
		//string fullFileName = filePath.Split('/')[filePath.Split('/').Length -1];
		//filePath = System.Web.Hosting.HostingEnvironment.MapPath("~/mainSite/Uploaded/MoveTemplate.txt");

		string line;
		string[] parseLine;
		System.IO.StreamReader file = new System.IO.StreamReader(filePath);
		
		while ((line = file.ReadLine()) != null) {
			parseLine = line.Split('\t');
			Moves.Add(parseLine);
		}
		//Set the rest of the attributes
	}

	public void setMeta(int creator, string movers, string moveName, string moveDate, string moveLocation) {
		this.creator = creator;
		this.movers = movers;
		this.moveName = moveName;
		this.moveDate = Convert.ToDateTime(moveDate);
		this.moveListID = DateTime.Now.Ticks;
		this.moveLocation = moveLocation;
		this.createdDate = DateTime.Now.Date;	
	}
}
}