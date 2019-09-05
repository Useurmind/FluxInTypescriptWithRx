# Internationalization Support

Rfluxx offers a simple internationalization support package.

## Installation

You can use the [rfluxx yeoman generator](../tooling.md) to setup your project with internationalization support.

You can also install an npm package:

    npm i --save-dev rfluxx-i18n

## Getting started

Before you can use the resource management in your app you have to prepare it a little bit.

For most steps you can use the snippets from the [rfluxx vs code snippet extension](../tooling.md).

### Create language resources

First you need to create the files containing the resources for your project, e.g.

__i18n/Resources.en.ts__:
```typescript
export type ResourceTexts = typeof resources;

export const resources = {
    text1: "The first resource text",
};
```

__i18n/Resources.de.ts__:
```typescript
import { ResourceTexts } from "./Resources.en";

export const resources: ResourceTexts = {
    text1: "The first resource text in this language",
};
```

The resources are provided in a simple java script object. You can even create arbitrary constructs, e.g. subobjects in the resources.

### Create a language initialization file

Now you need to prepare your app specific languages and `ResourceText` class.

__i18n/Languages.ts__
```typescript
import { ILanguage, CreateResourceTextComponent } from "rfluxx-i18n";
import { ResourceTexts, resources as resourcesEn } from "./Resources.en";
import { resources as resourcesDe } from "./Resources.de";

export const ResourceText = CreateResourceTextComponent<ResourceTexts>();

export type Language = ILanguage<ResourceTexts>;

export const languages: Language[] = [
    {
        key: "en",
        caption: "English",
        resources: resourcesEn
    },
    {
        key: "de",
        caption: "Deutsch",
        resources: resourcesDe
    }
];
```

Here you first create a type `ResourceText` which you will use in your pages to create localized texts.

After that you specify the languages that you want to use. They include a

- `key`: Used for identifying the language (must be unique) and indicating it in the url
- `caption`: Caption to use for the language
- `resources`: The resource object that we just created and that contains the texts


### Register in global container

Finally you need to register the `IResourceStore` in your global container

__GlobalContainerFactory.ts__
```typescript
// ...
import { registerResourcesGlobally } from "rfluxx-i18n";

import { languages } from "./i18n/Languages";

export class GlobalContainerFactory extends GlobalContainerFactoryBase
{
    protected registerStores(builder: IGlobalContainerBuilder): void
    {
        registerResourcesGlobally(builder, languages);

        // ...
    }
}
```

### Use resource text in your components

Now that everything is setup you can use `ResourceText` components in your components:

```typescript
public render()
{
    return <div>
        <ResourceText getText={x => x.text1 }/>
    </div>
}
```

Note that you get code completion and error indication if you specify a resource that does not exist.

## Changing the language

To change the language you can bind a component to the `IResourceStore`. It provides everything that you need to change the language.

```typescript

```