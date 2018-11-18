# URLs and Pages

As you probably know a URL consists of different parts. The framework uses the same naming as `window.location` or the URL class so you can easily identify what is meant.

- **origin**: protocol, host and port make up the origin (e.g. `https://www.myapp.com:443`). This is probably the most important part of an URL but has mostly no meaning for our framework because we are only routing inside an app where the origin stays the same all the time.
- **pathname**: the pathname is the multi slash path following the origin, e.g. `/myapp/orders/123`. For our page routing algorithm this is the most important part.
- **search**: the search is the set of arguments following the path, e.g. `?myvar1=value1&myvar2=value2`. We also base our page routing algorithm on this part.
- **hash**: the final part of the URL starting with a hash, e.g. `#myhash/whatever/i/like`. This part is mostly ignored by the page routing and you are free to use this part for intra page routing.

## Example

Take the following URL:
 ```https://www.rfluxx.com/myapp/users?id=1#address```

The URL should show the address of the user with id 1. 

Note that we put the info about showing the address into the hash. This means our page must decide for itself based on the hash what part of the user it wants to show. If it should show the personal information that would mean a different hash value. The page must recognize the different hashes and do the necessary processing itself (also reacting on hash changes). The framework does not bother with the hash.

What is evaluated by the framework is the path and search of the URL.

`/myapp/users?id=1`

This string represents the id for the page. Each page id is assigned a different persistent state.

For this user page it means that the state of each different user is persisted in the page routing system.

Let's say we navigate to the following URLs in short succession

- `https://www.rfluxx.com/myapp/users?id=1#address`
- `https://www.rfluxx.com/myapp/users?id=2#address`
- `https://www.rfluxx.com/myapp/users?id=3#address`

We will now have the state for three user pages in memory, namely for the users with ids 1, 2, and 3.

When navigating back to the pages this will save loading time as the app does not need to call the server again for the users. 