# State Eviction

It is important to clearly define how page state is evicted after leaving/navigating away from a page.

Page state eviction on the case of rfluxx means deleting the container holding the stores for a page.

That means once a page is evicted all data of that page must be loaded again from the server.

## Eviction strategies

When browsing through the app page state can be evicted based on similar criteria as other caches. The goal here could be making navigating forward and backward as fast as possible. 

In addition if the user made changes to the browsed pages like filter settings they should be kept as long as possible.

### LRU strategy

Keeping a history of the state of last X recently used pages can speed up navigation as the data required for the pages is already there.

### Custom eviction strategy

You could also implement your own eviction strategy. The framework allows this by injecting an instance that implements the proper interface.

## Edit mode

There is however a case in which state should never be evicted without user consent.

As soon as editing starts the edited data should be kept. The fact that something is edited must be stated by the edit UI explicitly. Naturally the edit UI must also state that editing has finished and the state can now be evicted again. 

If a page is in edit mode all of the state of that page should be kept.

With this eviction strategy it also becomes possible to show reminders of open edit pages in different cases like closing the browser tab.
