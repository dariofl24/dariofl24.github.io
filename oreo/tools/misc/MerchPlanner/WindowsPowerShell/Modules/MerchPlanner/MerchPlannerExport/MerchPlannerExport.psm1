Set-Variable MERCHANDISING_TABLE_NAME -option Constant -value 'Merchandising'
Set-Variable MERCH_PLANNER_TABLE_NAME -option Constant -value 'Merchandise Plan'

function ExportMerchPlannerToCsv {

	param(
		[string]$connectionString = $(throw "Connection string is required"), 
		[ValidateScript({Test-Path $_ -isvalid})] [string]$exportFilePath
	)
	
	$objOleDbConnection = ConnectToDb($connectionString)
	if($objOleDbConnection -ne $null) {
		$objOleDbCommand = New-Object System.Data.OleDb.OleDbCommand
		$objOleDbCommand.Connection = $objOleDbConnection
		
		$objOleDbCommand.CommandText = "SELECT * FROM [$MERCHANDISING_TABLE_NAME]"
		
		#$objOleDbCommand.CommandText = @"
		#	SELECT m.[MasterProductID],
		#			m.[BrandSegment],
		#			m.[ProductType],
		#			m.[SKU],
		#			m.[ProductName],
		#			m.[SizeChart],
		#			m.[SizeChartMessaging],
		#			m.[Color],
		#			m.[MainColorHex],
		#			m.[AccentColorHex],
		#			m.[Cut],
		#			m.[Gender],
		#			m.[Material],
		#			m.[NewMaterial],
		#			m.[Price],
		#			m.[SalePrice],
		#			m.[LifeCycle],
		#			m.[InitialPairsOrdered],
		#			m.[Description],
		#			m.[NikeProductID],
		#			m.[InstanceID],
		#			IIF(m.[CurrentStatus] = 'Active', 1, 0) as Online
		#	FROM [$MERCHANDISING_TABLE_NAME] m
#"@
		
		$objOleDbAdapter = New-Object System.Data.OleDb.OleDbDataAdapter
		$objOleDbAdapter.SelectCommand = $objOleDbCommand
		
		$objDataSet = New-Object System.Data.DataSet
		$objOleDbAdapter.Fill($objDataSet, "QueryResults")
		
		$objDataSet.Tables[0] | Export-Csv $exportFilePath -notypeinformation
		
		$objOleDbConnection.Close()
	}
}