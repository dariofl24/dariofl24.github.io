Set-Variable MERCHANDISING_TABLE_NAME -option Constant -value 'Merchandising'
Set-Variable MERCH_PLANNER_TABLE_NAME -option Constant -value 'Merchandise Plan'

function CreateMerchandisingTable {
	param(
		[string]$connectionString = $(throw "Connection string is required")
	)
	
	$objOleDbConnection = ConnectToDb($connectionString)
	if ($objOleDbConnection -ne $null) {
		if (DoesTableExist $objOleDbConnection $MERCHANDISING_TABLE_NAME) {
			"Dropping $MERCHANDISING_TABLE_NAME table..."
			ExecuteSql $objOleDbConnection "DROP TABLE $MERCHANDISING_TABLE_NAME"
		}
		
		"Creating $MERCHANDISING_TABLE_NAME table..."
		$sql = @"
			CREATE TABLE [$MERCHANDISING_TABLE_NAME](
				[MasterProductID] TEXT(50),
				[MerchPlannerCategory] TEXT(100),
				[Pillar] TEXT(50),
				[BrandSegment] TEXT(50),
				[ProductType] TEXT(50),
				[Collection] TEXT(50),
				[SKU] TEXT(20),
				[ProductName] TEXT(255),
				[SizeChart] TEXT(100),
				[SizeChartMessaging] TEXT(255),
				[Color] TEXT(100),
				[MainColorHex] TEXT(10),
				[AccentColorHex] TEXT(10),
				[Cut] TEXT(100),
				[Gender] TEXT(100),
				[Material] TEXT(100),
				[NewMaterial] TEXT(100),
				[Price] CURRENCY,
				[SalePrice] CURRENCY,
				[ActualStartDate] DATETIME,
				[TargetLaunchDate] DATETIME,
				[InitialSeasonLaunch] TEXT(100),
				[CurrentStatus] TEXT(50),
				[LifeCycle] TEXT(50),
				[InitialPairsOrdered] DOUBLE,
				[Description] MEMO,
				[NikeProductID] TEXT(50),
				[InstanceID] TEXT(100),
				[FOB] CURRENCY,
				[APS] DOUBLE,
				[ProdManOnly] YESNO DEFAULT false)
"@
	
		ExecuteSql $objOleDbConnection $sql
		
		$objOleDbConnection.Close()
	}
}

function CopyMerchPlannerData {
	param(
		[string]$connectionString = $(throw "Connection string is required")
	)
	
	$objOleDbConnection = ConnectToDb($connectionString)
	if ($objOleDbConnection -ne $null) {
		
		"Deleting all data from $MERCHANDISING_TABLE_NAME table..."
		$sql = "DELETE FROM $MERCHANDISING_TABLE_NAME"
		
		ExecuteSql $objOleDbConnection $sql
		
		"Copying $MERCH_PLANNER_TABLE_NAME table data into $MERCHANDISING_TABLE_NAME table..."
		$sql = @"
			INSERT INTO [$MERCHANDISING_TABLE_NAME](
				[MerchPlannerCategory],
				[Pillar],
				[ProductType],
				[Collection],
				[SKU],
				[ProductName],
				[SizeChart],
				[Color],
				[Cut],
				[Gender],
				[Material],
				[Price],
				[SalePrice],
				[ActualStartDate],
				[TargetLaunchDate],
				[InitialSeasonLaunch],
				[CurrentStatus],
				[LifeCycle],
				[InitialPairsOrdered],
				[Description])
			SELECT 
				TRIM(mp.Category) as MerchPlannerCategory,
				TRIM(mp.Pillar) as Pillar,
				IIF(LCASE(mp.Pillar) = 'converse one', 
						'dyo',
						IIF(LCASE(mp.Pillar) = 'gift cards', 
							IIF(LEFT(LCASE(TRIM(mp.Style)), 2) = 'ec', 
								'electronicgc', 
								'physicalgc'), 
						'regular')
				) as ProductType,
				TRIM(mp.Collection) as Collection,
				TRIM(mp.Style) as SKU, 
				TRIM(mp.Model) as ProductName,
				SWITCH(LCASE(mp.Gender) = 'kids' OR LCASE(mp.Gender) = 'kid''s', 'Kids', 
						LCASE(mp.Gender) = 'infants' OR LCASE(mp.Gender) = 'infant''s', 'Kids-Infants',
						LCASE(mp.Gender) = 'youth' OR LCASE(mp.Gender) = 'youth''s', 'Kids-Youth',
						LCASE(mp.Gender) = 'extyouth' OR LCASE(mp.Gender) = 'junior' OR LCASE(mp.Gender) = 'junior''s', 'Kids-ExtYouth',
						LCASE(mp.Gender) = 'newborn', 'Kids-Newborn',
						True, NULL) as SizeChart,
				TRIM(mp.Color) as Color, 
				TRIM(mp.Cut) as Cut, 
				TRIM(mp.Gender) as Gender, 
				TRIM(mp.Material) as Material,
				mp.[Consumer Price] as Price, 
				IIF(ISNULL(mp.[Clearance Price]), 0, mp.[Clearance Price]) as SalePrice, 
				mp.[Actual Start Date] as ActualStartDate,
				mp.[Target Launch Date] as TargetLaunchDate,
				mp.[Initial Season Launch] as InitialSeasonLaunch,
				mp.[Current Status] as CurrentStatus,
				mp.[Life Cycle] as LifeCycle,
				mp.[Initial Pairs Ord] as InitialPairsOrdered,
				mp.[Product Copy] as Description
			FROM [$MERCH_PLANNER_TABLE_NAME] mp
			WHERE mp.Style IS NOT NULL 
				AND mp.[Consumer Price] IS NOT NULL 
				AND mp.[Current Status] NOT IN ('Dropped', 'Cancelled')
"@
		ExecuteSql $objOleDbConnection $sql
	
		$objOleDbConnection.Close()
	}
}

function ImportProdManData {
	param(
		[string]$connectionString = $(throw "Connection string is required"), 
		[ValidateScript({Test-Path $_})] [string]$importFilePath
	)
	
	$objOleDbConnection = ConnectToDb($connectionString)
	if ($objOleDbConnection -ne $null) {
		$objOleDbCommand = New-Object System.Data.OleDb.OleDbCommand
		$objOleDbCommand.Connection = $objOleDbConnection
		
		$updateSql = @"
				UPDATE [$MERCHANDISING_TABLE_NAME]
				SET MasterProductID = @MasterProductID,
					BrandSegment = @BrandSegment,
					ProductName = @ProductName,
					SizeChart = @SizeChart,
					SizeChartMessaging = @SizeChartMessaging,
					Color = @Color,
					MainColorHex = @MainColorHex,
					AccentColorHex = @AccentColorHex,
					Cut = @Cut,
					Gender = @Gender,
					Price = @Price,
					SalePrice = @SalePrice,
					Description = @Description,
					NikeProductID = @NikeProductID,
					InstanceID = @InstanceID,
					ProdManOnly = false
				WHERE SKU = @SKU
"@

		$insertSql = @"
				INSERT INTO [$MERCHANDISING_TABLE_NAME](
					MasterProductID,
					BrandSegment,
					ProductName,
					SizeChart,
					SizeChartMessaging,
					Color,
					MainColorHex,
					AccentColorHex,
					Cut,
					Gender,
					Price,
					SalePrice,
					Description,
					NikeProductID,
					InstanceID,
					SKU,
					ProdManOnly
				)
				VALUES(
					@MasterProductID,
					BrandSegment,
					@ProductName,
					@SizeChart,
					@SizeChartMessaging,
					@Color,
					@MainColorHex,
					@AccentColorHex,
					@Cut,
					@Gender,
					@Price,
					@SalePrice,
					@Description,
					@NikeProductID,
					@InstanceID,
					@SKU,
					true
				)
"@

		$objOleDbCommand.Parameters.Add("@MasterProductID", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@BrandSegment", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@ProductName", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@SizeChart", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@SizeChartMessaging", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@Color", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@MainColorHex", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@AccentColorHex", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@Cut", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@Gender", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@Price", [System.Data.OleDb.OleDbType]::Currency) | Out-Null 
		$objOleDbCommand.Parameters.Add("@SalePrice", [System.Data.OleDb.OleDbType]::Currency) | Out-Null 
		$objOleDbCommand.Parameters.Add("@Description", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@NikeProductID", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null 
		$objOleDbCommand.Parameters.Add("@InstanceID", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null
		$objOleDbCommand.Parameters.Add("@SKU", [System.Data.OleDb.OleDbType]::VarChar) | Out-Null

		"Importing ProdMan data from file: $importFilePath..."
		Import-Csv $importFilePath | % {
		
			$objOleDbCommand.Parameters["@MasterProductID"].Value = $($_.MasterProductID)
			$objOleDbCommand.Parameters["@BrandSegment"].Value = $($_.BrandSegment)
			$objOleDbCommand.Parameters["@ProductName"].Value = $($_.ProductName)
			$objOleDbCommand.Parameters["@SizeChart"].Value = $($_.SizeChart)
			$objOleDbCommand.Parameters["@SizeChartMessaging"].Value = $($_.SizeChartMessaging)
			$objOleDbCommand.Parameters["@Color"].Value = $($_.Color)
			$objOleDbCommand.Parameters["@MainColorHex"].Value = $($_.MainColorHex)
			$objOleDbCommand.Parameters["@AccentColorHex"].Value = $($_.AccentColorHex)
			$objOleDbCommand.Parameters["@Cut"].Value = $($_.Cut)
			$objOleDbCommand.Parameters["@Gender"].Value = $($_.Gender)
			$objOleDbCommand.Parameters["@Price"].Value = $($_.Price)
			$objOleDbCommand.Parameters["@SalePrice"].Value = $($_.SalePrice)
			$objOleDbCommand.Parameters["@Description"].Value = $($_.Description)
			$objOleDbCommand.Parameters["@NikeProductID"].Value = $($_.NikeProductID)
			$objOleDbCommand.Parameters["@InstanceID"].Value = $($_.InstanceID)
			$objOleDbCommand.Parameters["@SKU"].Value = $($_.SKU)
			
			$objOleDbCommand.CommandText = $updateSql
			$rowsUpdated = $objOleDbCommand.ExecuteNonQuery()
			
			if ($rowsUpdated -eq 0) {
				$objOleDbCommand.CommandText = $insertSql
				$rowsInserted = $objOleDbCommand.ExecuteNonQuery()
				"Inserted product with SKU: $($_.SKU)"
			}
			else {
				"Updated product with SKU: $($_.SKU)"
			}
		}
		
		$objOleDbConnection.Close()
	}
}
