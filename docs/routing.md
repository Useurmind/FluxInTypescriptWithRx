# RFluXX Routing

RFluXX offers a ready made routing solution that comes with the following features:

- define routes including route parameters to match URLs
- define a site map to structure your app
- get an automatic breadcrumb based on the site map you defined
- let your views state be managed by the integrated state manager
- let your views communicate by exchanging arbitrary data
    
## Routes

Every view that a user can open in your app 
should have a URL that can be remembered
 or added to the favorites for later access.
Routes are a mechanism to recognize URL
patterns. Once the route for an URL has been
determined we can base further decisions on
this information.

__Example__:

This route

    home/user

could match the following URLs

    https://my.domain.com/home/user
    https://my.domain.com/home/user/list
    https://my.domain.com/home/user/create

As you can see the route matches more than
just a single path in this app. Therefore you will
usually have several routes that match more and
more specific URL paths.

For the example above we could add two more routes:

    home/user
    home/user/list
    home/user/create
    
With these three routes we can almost distinguish
between the three URL patterns given above.
The only thing that must be guaranteed is that
the routes are matched from more to less specific
e.g. in the following order:

    home/user/create
    home/user/list
    home/user
    
### Route parameters

Routes can also have parameters that can be used
to configure the UI shown for the route.

    home/{entityName}/list
    
This route has a parameter `entityName` and could match the following URL fragments:

    home/user/list: entityName = user
    home/setting/list: entityName = setting
    home/address/list: entityName = address
    
## Site Map

A site map is a tree that describes the structure of your app in terms of different views that are shown to the user. It helps the user understand how to navigate between the different views.

But it can also help in describing the structure of your page to your routing framework. ;)

Therefore RFluXX allows you to define a site map from which the UI is created that should be down to the user.

### Site Map Nodes

Each site map is a tree of so called site map nodes. The nodes contain the following information:

- caption of the node
- the route and parameter values to which the site map node applies
- instructions on how to create the UI content for the view of this site map node
- child site map nodes

### Breadcrumb

Based on the tree structure of the site map we can automatically derive a breadcrumb path that can be shown to the user. Such a breadcrumb makes orientation much easier for the user.

It is as simple as joining the captions of the site map nodes in the active path.

## View management

### View state

One very important aspect of routing in react apps is the management of state for inactive views.

In RFluXX state is saved in the different stores. This state must be persisted when navigating to a different view. When navigating back the last state should be available again. This is especially important for longer edit workflows that navigate forth and back between different edit views.

Also stores should be reusable across views and the creation of stores should not overlap in different views. This should be even the case when the developer is ignorant of this fact. Imagine a case where two views use the same store but for totally different data sets. The state and configuration for the stores in the two views must be different. But they must be retrievable as long as the views are active.

### View communication

Another important feature that is closely related to routing is the communication between views.

Imagine for example the opening of a new view to select/create data that should be used in the previous view.

We need a mechanism to open the second view from the first view and to retrieve the result data that the second view created.