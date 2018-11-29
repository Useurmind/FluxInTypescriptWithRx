import { ISiteMapNodeHit } from "../SiteMapStore";

import { IPageData } from "./IPageData";
import { IPageEvictionStrategy } from "./IPageEvictionStrategy";
import { IPageIdAlgorithm } from "./IPageIdAlgorithm";

/**
 * Options for the lru page eviction strategy.
 */
export interface ILruPageStateEvictionsOptions
{
    /**
     * The algorithm used to compute the page id.
     */
    pageIdAlgorithm: IPageIdAlgorithm;

    /**
     * This is the target number of pages in the cache.
     * The algorithm will not always achieve this number
     * due to other limitations like editing mode and page tracks.
     */
    targetNumberPagesInCache: number;
}

interface ILinkedList {
    previous: ILinkedList;
    next: ILinkedList;
    pageId: string;
}

/**
 * This strategy evicts the state of the pages that weren't used recently.
 * There are however some special attributes that need to be taken into account.
 * When a page has
 * - `isInEditMode` set to true
 * - is part of a page track
 * When a page is in edit mode we should not just throw away the edited content
 * ... TODO
 */
export class LruPageStateEvictions implements IPageEvictionStrategy
{
    private lruListHead: ILinkedList = null;
    private lruListTail: ILinkedList = null;
    private lruListMap: Map<string, ILinkedList> = new Map();

    constructor(private options: ILruPageStateEvictionsOptions) {}

    /**
     * @inheritDoc
     */
    public getEvictionsOnSiteMapNodeHit(siteMapNodeHit: ISiteMapNodeHit, pageMap: Map<string, IPageData>): string[]
    {
        const pageId = this.options.pageIdAlgorithm.getPageId(siteMapNodeHit.url);

        const isRepeatedHit = this.lruListMap.has(pageId);
        if (isRepeatedHit)
        {
            const pageEntry = this.lruListMap.get(pageId);
            this.removeFromLinkedList(pageEntry);
            this.addToFront(pageEntry);
        }

        if (this.lruListMap.size > this.options.targetNumberPagesInCache)
        {
            const numberEntriesToDelete = this.lruListMap.size - this.options.targetNumberPagesInCache;
            const entriesToDelete = this.getLastEntriesReversed(numberEntriesToDelete);
            const firstEntryToDelete = entriesToDelete[-1];

            // make the element before the one to delete the tail
            firstEntryToDelete.previous.next = null;
            this.lruListTail = firstEntryToDelete.previous;

            // delete all entries from the map
            for (const entry of entriesToDelete)
            {
                this.lruListMap.delete(entry.pageId);
            }

            // return the page ids of the pages to delete
            return entriesToDelete.map(x => x.pageId);
        }

        return [];
    }

    private addToFront(entry: ILinkedList): void
    {
        entry.next = this.lruListHead;
        this.lruListHead = entry;
        if (!this.lruListTail)
        {
            this.lruListTail = entry;
        }
    }

    private removeFromLinkedList(entry: ILinkedList): void
    {
        if (entry.previous)
        {
            entry.previous.next = entry.next;
        }

        if (entry.next)
        {
            entry.next.previous = entry.previous;
        }

        entry.next = null;
        entry.previous = null;

        if (this.lruListHead === entry)
        {
            this.lruListHead = entry.next;
        }

        if (this.lruListTail === entry)
        {
            this.lruListTail = entry.previous;
        }
    }

    /**
     * Get the last X entries of the list.
     * @param numberOfEntries Number of entries to deliver.
     * @returns The entries in reverse orders.
     */
    private getLastEntriesReversed(numberOfEntries: number): ILinkedList[]
    {
        const gatheredEntries: ILinkedList[] = [];
        let current: ILinkedList = this.lruListTail;
        for (let index = 0; index < numberOfEntries; index++)
        {
            gatheredEntries.push(current);

            current = current.previous;
        }

        return gatheredEntries;
    }
}
