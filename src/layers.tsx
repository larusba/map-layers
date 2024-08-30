const list: { itemId: string, label: string, level: number }[] = [
    {
        itemId: "layer1",
        label: "Earthquakes since 1970",
        level: 0
    },
    {
        itemId: "layer2",
        label: "USA Information",
        level: 0
    },
    {
        itemId: "layer3",
        label: "USA States",
        level: 0
    },
    {
        itemId: "layer4",
        label: "World Time Zones",
        level: 0
    },
];

export function treeItems() {
    return list;
}