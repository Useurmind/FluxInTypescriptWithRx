# Site Maps

The site map of your app defines the structure by which users can orient themselves across your site.

A site map is a tree of site map nodes. Each node defines a page that a user can access on your site.

# Site map node urls

To access the page of a site map node the user needs to navigate to the url that is assigned to that node.

Urls can be:

- relative to the parent url (no slash in the front)
- absolute to the root of the site (starts with a slash)

# Pages

Each site map node renders a page when it is hit via a matching url.

It will create a container (either from it's own container factory or from the global one) and use it to setup a page. 

You can configure any react component to be rendered as the page of the site map node.

# Breadcrumb

The one reason to have a site map is to efficiently create a breadcrumb from it when a page is opened.

That allows the user to easily find out where he is on the page.

To make this feature useful the text of the breadcrumb must be dynamically computable. Usually static texts are not enough to find out where you are on a page.