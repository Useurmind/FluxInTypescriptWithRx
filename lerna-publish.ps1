param(
    [Parameter(Mandatory=$True)]
    [string]$version
)

$ErrorActionPreference = "Stop"

lerna run testonce
lerna run build

lerna version $version --no-push

lerna publish from-git

