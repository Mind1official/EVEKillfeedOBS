# Data From: https://www.fuzzwork.co.uk/dump/latest/
# Define input/output path
$basePath = "c:\temp\evedata"
$outputPath = Join-Path $basePath "eve_insert.sql"

# Define file paths
$regionsFile = Join-Path $basePath "mapRegions.csv"
$constellationsFile = Join-Path $basePath "mapConstellations.csv"
$systemsFile = Join-Path $basePath "mapSolarSystems.csv"

# Read CSV files
Write-Host "📄 Loading CSV files..."
$regions = Import-Csv -Path $regionsFile
$constellations = Import-Csv -Path $constellationsFile
$systems = Import-Csv -Path $systemsFile

# Build SQL lines
$regionLines = @()
$constellationLines = @()
$systemLines = @()

Write-Host "🛠 Generating region insert statements..."
foreach ($region in $regions) {
    $regionID = $region.regionID
    $regionName = $region.regionName.Replace("'", "''")  # Escape single quotes
    $regionLines += "INSERT INTO wp_eve_regions (id, region_name) VALUES ($regionID, '$regionName');"
}

Write-Host "🛠 Generating constellation insert statements..."
foreach ($constellation in $constellations) {
    $constellationID = $constellation.constellationID
    $constellationName = $constellation.constellationName.Replace("'", "''")
    $regionID = $constellation.regionID
    $constellationLines += "INSERT INTO wp_eve_constellations (id, constellation_name, region_id) VALUES ($constellationID, '$constellationName', $regionID);"
}

Write-Host "🛠 Generating solar system insert statements..."
foreach ($system in $systems) {
    $systemID = $system.solarSystemID
    $systemName = $system.solarSystemName.Replace("'", "''")
    $constellationID = $system.constellationID
    $security = if ($system.security) { [math]::Round([double]$system.security, 2).ToString("0.00") } else { "NULL" }

    $systemLines += "INSERT INTO wp_eve_systems (id, system_name, constellation_id, security_status) VALUES ($systemID, '$systemName', $constellationID, $security);"
}

# Combine and write SQL
Write-Host "📝 Writing output SQL to $outputPath"
$allLines = @(
    "-- SQL Dump generated from CSV files"
    "-- Regions"
    $regionLines
    "`n-- Constellations"
    $constellationLines
    "`n-- Systems"
    $systemLines
)

$allLines | Out-File -Encoding UTF8 -FilePath $outputPath -Force
Write-Host "✅ SQL generation complete. Total inserts: Regions=$($regionLines.Count), Constellations=$($constellationLines.Count), Systems=$($systemLines.Count)"
