$ErrorActionPreference = "Stop"

lerna bootstrap --hoist --nohoist=@types* -- --no-optional

