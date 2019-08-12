param(
    [Parameter(Mandatory=$True)]
    [string]$version
)

$ErrorActionPreference = "Stop"

lerna run build
lerna run testonce

lerna version $version --no-push

lerna publish from-git

