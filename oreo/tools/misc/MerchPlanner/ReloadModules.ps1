
Get-Module -list | where{$_.name -like "MerchPlanner*"} | Remove-Module | Import-Module
