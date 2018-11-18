# Route parameters

As already described in the [introduction](routing.md) each route can have several parameters. These parameters can be used to configure the pages that are rendered for the different routes.

## Path parameters

When putting parameters in a path you can extract each part  of the path (between the slashes).

**Example:**

    /myapp/users/{username}/

This route would match e.g. the following URLs:

    https://my.example.com/myapp/users/johndoe#address
    https://my.example.com/myapp/users/elizabethshawn?details=true#address

The variable `username` would have the values `johndoe`, and `elizabethshawn` respectively. 

## Search parameters

The parameters of the search part of the URL are extracted automatically.

But you will need to define wildcards for variable values that should not influence the routing decision. 

    /myapp/users?username={*}&details={*}

This route will match any URL with parameters `username` and `details` and extract their values.

Also the order of variables in the search does not matter. A route with search parameters will match any route that includes those search parameters, irrespective of their order.

These routes are equivalent:

    /myapp/users?username={*}&details={*}
    /myapp/users?details={*}&username={*}

## Hash parameters

The hash can be quite anything depending on your apps usage of it. Therefore, it is complicated to define an algorithm that works in all cases.

Rfluxx therefore provides the possibility to use regex with named capture groups for extracting parameters from the hash.

**Example:**

    /myapp/users/{username}?details={*}#show_address=(?<show_address>(true|false))

This route will extract the parameters `username`, `details` and `show_address` (which can be either true or false).