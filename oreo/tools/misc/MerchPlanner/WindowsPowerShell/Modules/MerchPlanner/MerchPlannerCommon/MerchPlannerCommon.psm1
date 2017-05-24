function Launch32Bit {
	param(
		[ValidateScript({Test-Path $_})] [string]$scriptPath
    )

	if ($env:Processor_Architecture -ne "x86") { 
		write-warning 'Launching x86 PowerShell'
		&"$env:windir\syswow64\windowspowershell\v1.0\powershell.exe" -noninteractive -noprofile -file $scriptPath -executionpolicy bypass
		exit
	}
	#$env:Processor_Architecture
	#[IntPtr]::Size
}

function LoadConfig {
	param(
		[ValidateScript({Test-Path $_})] [string]$configPath
    )
	
	$global:merchPlannerSettings = @{}
	$config = [xml](Get-Content $configPath)
	
	foreach ($addNode in $config.configuration.appsettings.add) {
		if ($addNode.Value.Contains(",")) {
			# Array case
			$value = $addNode.Value.Split(",")
			for ($i = 0; $i -lt $value.length; $i++) {
				value[$i] = $value[$i].Trim()
			}
		}
		else {
			# Scalar case
			$value = $addNode.Value
		}
		
		$global:merchPlannerSettings[$addNode.Key] = $value
	}
}

function ConnectToDb([string]$connectionString) {
	$objOleDbConnection = New-Object System.Data.OleDb.OleDbConnection
	$objOleDbConnection.ConnectionString = $connectionString
	$objOleDbConnection.Open()
	
	if ($objOleDbConnection.State -eq [System.Data.ConnectionState]::Open) {
		return $objOleDbConnection 
	} 
	
	return $null
}

function GetTableMetaData([System.Data.OleDb.OleDbConnection]$objOleDbConnection, [string]$tableName) {
	return $objOleDbConnection.GetOleDbSchemaTable([System.Data.OleDb.OleDbSchemaGuid]::Tables, ($null, $null, $tableName, $null))
}

function GetTableColumnsMetaData([System.Data.OleDb.OleDbConnection]$objOleDbConnection, [string]$tableName) {
	return $objOleDbConnection.GetOleDbSchemaTable([System.Data.OleDb.OleDbSchemaGuid]::Columns, ($null, $null, $tableName, $null))
}

function DoesTableExist([System.Data.OleDb.OleDbConnection]$objOleDbConnection, [string]$tableName) {
	$table = GetTableMetaData $objOleDbConnection $tableName  
	return $table -ne $null
}

function DescribeTable([System.Data.OleDb.OleDbConnection]$objOleDbConnection, [string]$tableName) {
	$tables = $objOleDbConnection.GetOleDbSchemaTable([System.Data.OleDb.OleDbSchemaGuid]::Tables, $null)
	$table = $tables | where {$_.TABLE_NAME -eq $tableName}
	if ($table -ne $null) {
		$columns = $objOleDbConnection.GetOleDbSchemaTable([System.Data.OleDb.OleDbSchemaGuid]::Columns, ($null, $null, $tableName, $null))
		$columns #| select COLUMN_NAME, DATA_TYPE, IS_NULLABLE, ORDINAL_POSITION, COLUMN_HASDEFAULT  
	}
}

function ExecuteSql([System.Data.OleDb.OleDbConnection]$objOleDbConnection, [string]$sql) {
	$objOleDbCommand = New-Object System.Data.OleDb.OleDbCommand
	$objOleDbCommand.Connection = $objOleDbConnection
	$objOleDbCommand.CommandText = $sql
    $objOleDbCommand.ExecuteNonQuery() | Out-Null
}
