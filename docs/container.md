# Using a container

Working with static instances of stores makes you inflexible regarding the reuse of the stores.

Therefore, rfluxx provides an integrated container that works good for its purposes.

The container has a very simple but powerful structure. You register functions that will create an instance of a type when required. Let's call this a creation rule. A creation rule gets the container as an argument and can resolve all other registrations in this container. In this way you can easily inject dependencies into your classes. This approach automatically solves problems like the ordering of creating instances and only creating required instances.

The power of the container then mostly comes from managing instances created from registered creation rules.

It provides several features to do so:

* register creation rules under one or multiple string keys
* register creation rules to be added to one or multiple collections of creation rules
* resolving default/named instances of a registered creation rule (only one instance is created per rule and name)
* resolving collections of default/named instances created through different creation rules (the collection contains all the default instances or instances with the specified name of each relevant rule)

There are reasons for this very specific feature set.

We use the container to control that stores which hold the state of our app are kept in memory. Therefore, the container creates and remembers all created instances, so that they can be resolved again later. This is important if we use react navigation frameworks that take components referencing a store completely out of memory. This would mean we loose our state if the stores are not referenced anymore in some other component. Keeping all stores in the container avoids this problem.

Second there are cases when you want to use several instances of a store for different components in the UI. For this case you can either register multiple creation rules or resolve named instances of the same rule. Both strategies have the effect that you get different instances of the same store type back.

## Container workflow

Container usage is a three step process:

* Register creation rules
* Build container
* Resolve instances from container

```typescript
const builder = new SimpleContainerBuilder();

builder.register(...).as(...);

const container = builder.build();

const instance = container.resolve<...>(...);
```

## How to

### Atomic creation rule

Register creation of class without dependencies

```typescript
builder.register(c => new MyClassWithoutDependencies())
```

### Dependent creation rule

Register creation of class with dependencies

```typescript
// register atomic dependency
// ...

// register dependent type
builder.register(c => new MyClassWithDependencies(
    c.resolve<MyClassWithoutDependencies>("MyClassWithoutDependencies")))
```

### Static creation rule

Register an already existing instance

```typescript
const existingInstance = // ...

builder.register(c => existingInstance)
```

### Coded creation rule

Register some complex piece of code that creates an instance

```typescript
builder.register(c => {
    // fancy code to create instance

    return myInstance;
})
```

### Register under key

Register a creation rule under one or multiple string keys

```typescript
builder.register(c => /* ... */).as("IMyType");
```

By convention the key could be the interface that is implemented by the returned instance.

### Register in collection

Register a creation rule into one or several collections

```typescript
builder.register(c => /* ... */).in("IDoStuffInCollection[]");
```

By convention the name of a collection should be the type of interface named followed by an array, e.g. `IDoStuffInCollection[]`.

### Mix and match registration

You can mix and match all of the above techniques:

```typescript
builder.register(c => /* ... */)
       .in("IDoStuffInCollection[]")
       .as("IMyType")
       .as("ISecondInterface");
```

### Resolve a default instance

Resolve the default instance from the container

```typescript
container.resolve<IMyType>("IMyType");
```

### Resolve an optional default instance

Resolve the default instance from the container or get null if no instance was registered under the given key.

```typescript
// returns null if the key IMyType was not registered
container.resolveOptional<IMyType>("IMyType");
```

### Resolve named instance

```typescript
container.resolve<IMyType>("IMyType", "instance1");
```

### Resolve collection of default instances

```typescript
// returns an IDoStuffInCollection[]
container.resolveMultiple<IDoStuffInCollection>("IDoStuffInCollection[]");
```

### Resolve collection of named instances

```typescript
// returns an IDoStuffInCollection[]
container.resolveMultiple<IDoStuffInCollection>("IDoStuffInCollection[]", "list1");
```