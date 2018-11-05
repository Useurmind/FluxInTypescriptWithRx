# Topics for documentation



## two forms of navigation

Plain URL routing allows to only navigate via history. No communication between pages possible.

Page routing sees pages as unit of work that can be parametrized and return a result. It is based on URL routing but also includes ways to transfer data between pages. Page routing is performed by stores as react components do not persist between routing actions.

## page state

A page is the implementation of UI for a single route.

The state of a page is the sum of store instances used specifically in that page. All other "state" like the data contained in the components of the page should be assumed to be evicted when a different route is hit.

## store management

To make stores reusable across pages and not use static instances defined somewhere in a module rfluxx manages stores centrally via a container.

## state eviction & edit mode

It is important to clearly define how page state is evicted after leaving/navigating away from a page.

When browsing through the app page state can be evicted based on similar criteria as other caches. The goal here is making navigating forward and backward as fast as possible. Keeping a history of the state of X pages can speed up navigation as the data required for the pages is already there.

In addition the user made changes to the browsed pages like filter settings should be kept as long as possible. So it could make sense to keep these separately or locally persisted (see UI setting persistence).

There is however a case in which state should never be evicted without user consent. As soon as editing starts the edited data should be kept. The fact that something is edited must be stated by the edit UI explicitly. Naturally the edit UI must also state that editing has finished and the state can now be evicted again. If a page is in edit mode all of the state of that page should be kept.

With this eviction strategy it also becomes possible to show reminders of open edit pages in different cases like closing the browser tab.

## UI setting persistence

??