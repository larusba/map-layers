import { Map, View } from 'ol';
import 'ol/ol.css';
import React, { useEffect, useRef } from 'react';
import InfoLayer from './InfoLayer';
import "./Map.css";
import { ImageArcGISRest, OSM } from 'ol/source.js';
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer.js';
import TileWMS from 'ol/source/TileWMS.js';
import BaseLayer from 'ol/layer/Base';
import { ServerType } from 'ol/source/wms';

interface LayerConfig {
    type: 'ImageArcGISRest' | 'TileWMS';
    url: string;
    params?: { [key: string]: any };
    serverType?: ServerType;
    visible: boolean;
}

const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);

    const layersConfig: LayerConfig[] = [
        {
            type: 'ImageArcGISRest',
            url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/Earthquakes_Since1970/MapServer',
            visible: false,
        },
        {
            type: 'ImageArcGISRest',
            url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/USA/MapServer',
            visible: false,
        },
        {
            type: 'TileWMS',
            url: 'https://ahocevar.com/geoserver/wms',
            params: { 'LAYERS': 'usa:states', 'TILED': true },
            serverType: 'geoserver',
            visible: false,
        },
        {
            type: 'ImageArcGISRest',
            url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/WorldTimeZones/MapServer',
            visible: false,
        },
    ];

    const [visibleLayers, setVisibleLayers] = React.useState<boolean[]>(layersConfig.map(layer => layer.visible));

    const baseLayer = new TileLayer({
        source: new OSM(),
        visible: true,
    });

    const createLayer = (config: LayerConfig, index: number): BaseLayer | null => {
        if (config.type === 'ImageArcGISRest') {
            return new ImageLayer({
                source: new ImageArcGISRest({
                    ratio: 1,
                    params: config.params || {},
                    url: config.url,
                }),
                visible: visibleLayers[index],
            });
        } else if (config.type === 'TileWMS') {
            return new TileLayer({
                source: new TileWMS({
                    url: config.url,
                    params: config.params || {},
                    serverType: config.serverType,
                }),
                visible: visibleLayers[index],
            });
        }
        return null;
    };

    useEffect(() => {
        if (!mapRef.current) return;

        const layers = [baseLayer, ...layersConfig.map((config, index) => createLayer(config, index)).filter((layer): layer is BaseLayer => layer !== null)];

        const mapObj = new Map({
            view: new View({
                center: [-11000000, 4600000],
                zoom: 2,
            }),
            layers: layers,
        });

        mapObj.setTarget(mapRef.current);

        return () => mapObj.setTarget('');
    }, [visibleLayers]);

    return (
        <div className="map" ref={mapRef}>
            <InfoLayer setTiles={setVisibleLayers} tiles={visibleLayers} />
        </div>
    );
}

export default MapComponent;
