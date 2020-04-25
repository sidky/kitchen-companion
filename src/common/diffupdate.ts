export async function diffUpdate<T>(items: T[],
                                    find:(s: T[])=>Promise<number[]>,
                                    add:(s: T[])=>Promise<number[]>) {
    const foundIds = await find(items);
    const newItems = new Array<T>();
    const ids = new Array<number>();

    for (let i = 0; i < items.length; i++) {

        // Filter null ids, which needs to be inserted
        if (foundIds[i] == null) {
            newItems.push(items[i]);
        }
        ids.push(foundIds[i]);
    }

    // Add new items
    const newIds = await add(newItems);

    // Put everything together
    for (let i = 0, j = 0; i < items.length; i++) {
        if (ids[i] == null) {
            ids[i] = newIds[j++];
        }
    }
    return ids;
}

export function applyToAll<T, V>(list: T[], fn: (i: T)=>V): V[] {
    const transformed = new Array<V>();

    for (const i of list) {
        transformed.push(fn(i));
    }

    return transformed;
}

export function applyPairToAll<T, U, V>(list1: T[], list2: U[], fn: (t: T, u: U) => V): V[] {
    const l = Math.min(list1.length, list2.length);
    const transformed = new Array<V>();

    for (let i = 0; i < l; i++) {
        transformed.push(fn(list1[i], list2[i]));
    }
    return transformed;
}
