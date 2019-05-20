param(
    [string]$version
)

lerna run testonce
lerna run build

lerna version $version --no-push

lerna publish from-git

