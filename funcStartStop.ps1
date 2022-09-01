param(
    [Parameter(Mandatory = $true)]
    [int]
    $turnOffFunc,
    [Parameter(Mandatory = $true)]
    [string]
    $connectionString,
    [Parameter(Mandatory = $true)]
    [string]
    $container,
    [Parameter(Mandatory = $true)]
    [string]
    $prefix,
    [Parameter(Mandatory = $true)]
    [string]
    $resourceGroup,
    [Parameter(Mandatory = $true)]
    [string]
    $funcName
)

if ($turnOffFunc -eq 1) {
    $storageContext = New-AzStorageContext -ConnectionString $connectionString

    $blobs = Get-AzStorageBlob -Container $container -Prefix $prefix -Context $storageContext 

    if ($blobs.Length -le 1) {
        Write-Host "Stop $funcName"
        Get-AzFunctionApp -ResourceGroupName $resourceGroup -Name $funcName | Stop-AzFunctionApp -Force
    } else {
        Write-Host "##vso[task.LogIssue type=error;] Files are being processed, please wait till files are processed to rerun pipeline"  
        exit 1
    }
}
else {
    Write-Host "Start $funcName"
    Get-AzFunctionApp -ResourceGroupName $resourceGroup -Name $funcName | Start-AzFunctionApp 

}