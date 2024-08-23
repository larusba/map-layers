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

/*{
        itemId: "land",
        label: "Land Cover and Land Use Mapping",
        level: 0
    },
    {
        itemId: "sub-land",
        label: "Dynamic Land Cover",
        level: 1

    },
    {
        itemId: "sub-sub-land",
        label: "Land Cover 2019 (raster 100 m), global, yearly – version 3",
        level: 2
    },
    {
        itemId: "sub-land2",
        label: "CORINE Land Cover",
        level: 1

    },
    {
        itemId: "sub-sub-land2",
        label: "CORINE Land Cover 2018 (vector/raster 100 m), Europe, 6-yearly",
        level: 2

    },
    {
        itemId: "sub-land3",
        label: "CLC+Backbone",
        level: 1

    },
    {
        itemId: "sub-sub-land3",
        label: "CLC+Backbone 2021 (raster 10 m), Europe, 3-yearly",
        level: 2

    },
    {
        itemId: "area",
        label: "Priority Area Monitoring",
        level: 0

    },
    {
        itemId: "sub-area",
        label: "Coastal Zones",
        level: 1

    },
    {
        itemId: "sub-area2",
        label: "N2K",
        level: 1

    },
    {
        itemId: "bio",
        label: "Bio-geophysical Parameters",
        level: 0

    },
    {
        itemId: "sub-bio",
        label: "Soil Moisture",
        level: 1

    },
    {
        itemId: "satellite",
        label: "Satellite Data",
        level: 0

    },
    {
        itemId: "sub-satellite",
        label: "European Image Mosaic",
        level: 1

    },
    {
        itemId: "refdata",
        label: "Reference and Validation Data",
        level: 0

    },
    {
        itemId: "sub-refdata",
        label: "EU-Hydro",
        level: 1

    }*/