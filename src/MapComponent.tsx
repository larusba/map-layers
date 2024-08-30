import { Map, View } from 'ol';
import 'ol/ol.css';
import React, { useEffect, useRef, useState } from 'react';
import InfoLayer from './InfoLayer';
import "./Map.css";
import { ImageArcGISRest, OSM } from 'ol/source.js';
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer.js';
import TileWMS from 'ol/source/TileWMS.js';
import BaseLayer from 'ol/layer/Base';
import { ServerType } from 'ol/source/wms';
import { fromLonLat } from 'ol/proj';

interface LayerConfig {
    type: 'ImageArcGISRest' | 'TileWMS';
    url: string;
    params?: { [key: string]: any };
    serverType?: ServerType;
    visible: boolean;
    id: string;
}

const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapObjRef = useRef<Map | null>(null); // Ref per memorizzare l'oggetto mappa

    const layersConfig: LayerConfig[] = [
        {
            type: 'ImageArcGISRest',
            url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/Earthquakes_Since1970/MapServer',
            visible: false,
            id:'1',
        },
        {
            type: 'ImageArcGISRest',
            url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/USA/MapServer',
            visible: false,
            id:'2',
        },
        {
            type: 'TileWMS',
            url: 'https://ahocevar.com/geoserver/wms',
            params: { 'LAYERS': 'usa:states', 'TILED': true },
            serverType: 'geoserver',
            visible: false,
            id:'3',
        },
        {
            type: 'ImageArcGISRest',
            url: 'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/WorldTimeZones/MapServer',
            visible: false,
            id:'4',
        },
    ];

    const [visibleLayers, setVisibleLayers] = React.useState<boolean[]>(layersConfig.map(layer => layer.visible));

    const baseLayer = new TileLayer({
        source: new OSM(),
        visible: true,
    });

    const createLayer = (config: LayerConfig, index: number): BaseLayer | null => {
        let zIndex = index + 1;

        if (config.url === '4') {
            zIndex = 0;
        }

        let layer: BaseLayer | null = null;

        if (config.type === 'ImageArcGISRest') {
            layer = new ImageLayer({
                source: new ImageArcGISRest({
                    ratio: 1,
                    params: config.params || {},
                    url: config.url,
                }),
                visible: visibleLayers[index],
            });
        } else if (config.type === 'TileWMS') {
            layer = new TileLayer({
                source: new TileWMS({
                    url: config.url,
                    params: config.params || {},
                    serverType: config.serverType,
                }),
                visible: visibleLayers[index],
            });
        }



        if (layer) {
            layer.setZIndex(zIndex); // Imposta il zIndex del layer
        }

        return layer;
    };


    useEffect(() => {
        if (!mapRef.current) return;

        const layers = [baseLayer, ...layersConfig.map((config, index) => createLayer(config, index))
            .filter((layer): layer is BaseLayer => layer !== null)];

        const mapObj = new Map({
            view: new View({
                center: fromLonLat([0, 0]), // Coord. iniziali nel mezzo dell'oceano Atlantico
                zoom: 2,
            }),
            layers: layers,
        });

        mapObj.setTarget(mapRef.current);
        mapObjRef.current = mapObj; // Memorizza l'oggetto mappa

        return () => mapObj.setTarget('');
    }, [visibleLayers]);

    const zoomToCoordinates = (coords: [number, number]) => {
        if (mapObjRef.current) {
            const transformedCoords = fromLonLat(coords); // Conversione da EPSG:4326 a EPSG:3857
            mapObjRef.current.getView().setCenter(transformedCoords);
            mapObjRef.current.getView().setZoom(6); // Zoom a livello 6, può essere modificato secondo necessità
        }
    };

    const resizeZoomMap = () => {
        if (mapObjRef.current) {
            mapObjRef.current.getView().setZoom(2);
            mapObjRef.current.getView().setCenter([0, 0]);
        }
    }

    return (
        <div className="map" ref={mapRef}>
            <InfoLayer setTiles={setVisibleLayers} tiles={visibleLayers} zoomToCoordinates={zoomToCoordinates} resizeMap={resizeZoomMap} />
        </div>
    );
}

export default MapComponent;
