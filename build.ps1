function Build-Package()
{
    param(
        [string]$name
    )

    try {
        cd packages/$name

        write-host "Building package $name"
        npm run build
    }
    finally {
        cd ../..
    }
}

Build-Package "rfluxx"
Build-Package "rfluxx-react"
Build-Package "rfluxx-routing"
Build-Package "rfluxx-i18n"
Build-Package "rfluxx-mui-theming"
Build-Package "rfluxx-forms"
Build-Package "rfluxx-example"