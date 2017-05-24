Import-Module MerchPlanner/MerchPlannerImport

LoadConfig "MerchPlannerConfig.xml" 
$require32Bit = $merchPlannerSettings["Require32Bit"]
$connectionString = $merchPlannerSettings["ConnectionString"]
$importFilePath = $merchPlannerSettings["ImportFilePath"]

if ($require32Bit -eq $true) {
	Launch32Bit $script:MyInvocation.MyCommand.Path
}

CreateMerchandisingTable $connectionString
CopyMerchPlannerData $connectionString
ImportProdManData $connectionString $importFilePath 