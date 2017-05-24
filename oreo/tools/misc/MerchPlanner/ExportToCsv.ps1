Import-Module MerchPlanner/MerchPlannerExport

LoadConfig "MerchPlannerConfig.xml" 
$require32Bit = $merchPlannerSettings["Require32Bit"]
$connectionString = $merchPlannerSettings["ConnectionString"]
$exportFilePath = $merchPlannerSettings["ExportFilePath"]

if ($require32Bit -eq $true) {
	Launch32Bit $script:MyInvocation.MyCommand.Path
}

ExportMerchPlannerToCsv $connectionString $exportFilePath