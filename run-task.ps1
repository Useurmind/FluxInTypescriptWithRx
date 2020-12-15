param(
    [string]$task,
    [string]$command,
    [string]$package
)

$packages = @(
    "rfluxx"
    "rfluxx-debug"
    "rfluxx-react"
    "rfluxx-routing"
    "rfluxx-i18n"
    "rfluxx-mui-theming"
    "rfluxx-forms"
    "rfluxx-example"
)

if ($package) {
    $packages = @($package)
}

$currentDir = Get-Item .

foreach($p in $packages) {
    try {
        cd packages/$p
    
        if($task) {
            write-host "Running 'npm run $task' for package $p"
            npm run $task
        }

        if ($command) {
            write-host "Running command '$command' for package $p"
            Invoke-Expression $command
        }
    }
    finally {
        cd $currentDir.FullName
    }
}