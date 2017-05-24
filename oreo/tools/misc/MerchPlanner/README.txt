Requirements:

- PowerShell Version 2.0

- Microsoft Jet OLEDB Provider 4.0 (http://support.microsoft.com/kb/239114)
	or 
  Microsoft ACE OLEDB Provider 12.0 / 14.0 (http://www.microsoft.com/en-us/download/details.aspx?id=13255)



Installation instructions:

1. Copy MerchPlanner folder located in WindowsPowerShell\Modules under one of these two system-defined locations: 

User-specific:

	C:\Users\[username]\[My ]Documents\WindowsPowerShell\Modules

Machine-specific: 

	C:\Windows\System32\WindowsPowerShell\v1.0\Modules


2. Update MerchPlannerConfig.xml

a. Depending on your Windows version uncomment either Microsoft ACE OLEDB or Microsoft JET OLEDB "ConnectionString" property as well as a corresponding "Require32Bit" property.
   
	Note: Microsoft ACE OLEDB comes in both 32 and 64 bit versions while Microsoft JET OLEDB is distributed as a 32 bit version only.  

b. Make sure that the "Data Source" portion of the "ConnectionString" property specifies the full path to the MerchPlanner Access database file (.mdb file).

c. Update "ExportFilePath" property to have the desired location of a resulting CSV file.

d. Update "ImportMasterProductsFilePath" property to point to the location of the CSV file containing MasterProductID to SKU mappings. 

	Note: The script to import master products has a logic to run only if there is NO MasterProductID column present in the "Merchandise Plan" table (this is done to prevent accidental overwriting of the user managed mappings)


3. How to Use:

a. Start Windows PowerShell from the Start -> All Programs -> Accessories -> Windows PowerShell folder.

	Note: You may need to run PowerShell using "Run As Administrator" option.

b. Navigate to the folder with ExportToCsv.ps1 and ImportMasterProducts.ps1 scripts.

	Note: If you receive an error saying that the execution of scripts is disabled on this system please run the following command in the PowerShell window to update restriction policy:

	Set-ExecutionPolicy Unrestricted

c. Execute a desired script by typing its name in the PowerShell console.
