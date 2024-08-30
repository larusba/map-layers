import React, { useCallback, useEffect, useState } from "react";
import DehazeIcon from '@mui/icons-material/Dehaze';
import { Box, Button, Checkbox, FormControlLabel, Popover, Radio, RadioGroup, Tab, Tabs, TextField } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { treeItems } from "./layers";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { debounce } from "lodash";

export default function InfoLayer(props: any) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [coordinate, setCoordinate] = useState<string>("");
    const [nations, setNations] = useState<Array<{ id: string, nation: string, coordinate: string }>>([]);

    const setActiveLayer = (i: number) => {
        if (props.tiles[i]) {
            props.setTiles(props.tiles.slice(0, i).concat([false].concat(props.tiles.slice(i + 1))));
        } else {
            props.setTiles(props.tiles.slice(0, i).concat([true].concat(props.tiles.slice(i + 1))));
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSearchAnchorEl(event.currentTarget);
    };

    const handleSearchClose = () => {
        setSearchAnchorEl(null);
    };

    const handleCoordinateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCoordinate(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            const coordRegex = /^([-+]?\d{1,2}(?:\.\d+)?)[, ]\s*([-+]?\d{1,3}(?:\.\d+)?)$/;
            const match = coordinate.match(coordRegex);
            if (match) {
                const lat = parseFloat(match[1]);
                const lon = parseFloat(match[2]);
                props.zoomToCoordinates([lon, lat]);
                handleSearchClose(); // Chiude il popover dopo lo zoom
            } else {
                alert("Please enter valid coordinates (Ex. 41.8719, 12.5674)");
            }
        }
    };

    const debouncedZoomToCoordinates = useCallback(
        debounce((coordinate: string) => {
            const coordRegex = /^([-+]?\d{1,2}(?:\.\d+)?)[, ]\s*([-+]?\d{1,3}(?:\.\d+)?)$/;
            const match = coordinate.match(coordRegex);
            if (match) {
                const lat = parseFloat(match[1]);
                const lon = parseFloat(match[2]);
                props.zoomToCoordinates([lon, lat]);
                handleSearchClose(); // Chiude il popover dopo lo zoom
            } else {
                alert("Please enter valid coordinates (Ex. 41.8719, 12.5674)");
            }
        }, 500),
        []
    );

    const handleRadioButtonClick = (coordinates: string) => {
        setCoordinate(coordinates);
        debouncedZoomToCoordinates(coordinates);
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const open = Boolean(anchorEl);
    const searchOpen = Boolean(searchAnchorEl);
    const id = open ? 'simple-popover' : undefined;
    const searchId = searchOpen ? 'search-popover' : undefined;

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const list = treeItems();

    useEffect(() => {
        if (Boolean(searchAnchorEl) && nations.length === 0) {
            fetch('https://mapstest3.free.beeceptor.com/nations')
                .then(response => response.text())
                .then(data => {
                    const nationsList = JSON.parse(data.substring(1, data.length - 1))
                    setNations(nationsList);
                })
                .catch(error => console.error(error));
            
        }
    }, [Boolean(searchAnchorEl)])

    return (
        <div>
            <Button size="large" startIcon={<DehazeIcon sx={{ minBlockSize: '50px' }} />} aria-describedby={id} onClick={handleClick} />
            <Popover sx={{ maxHeight: '400px' }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Products and datasets" {...a11yProps(0)} />
                        <Tab label="Active layers" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Box>
                        <SimpleTreeView>
                            {list.map((element, i) => {
                                return (
                                    <Box key={i} flexDirection="row" sx={{ display: "flex", justifyContent: 'space-between' }}>
                                        <div onClick={() => setActiveLayer(i)} style={{ display: "flex" }}>
                                            <Checkbox defaultChecked={props.tiles[i]}></Checkbox>
                                            <TreeItem itemId={element.itemId} label={element.label} />
                                        </div>
                                        {props.tiles[i] ?
                                            <Button startIcon={<DownloadIcon />}></Button> : <></>}
                                    </Box>
                                )
                            })}
                        </SimpleTreeView>
                    </Box>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Box>
                        <SimpleTreeView>
                            {list.map((element, i) => {
                                return (
                                    (
                                        props.tiles[i] ?
                                            <Box key={i} flexDirection="row" sx={{ display: "flex", justifyContent: 'space-between' }}>
                                                <TreeItem itemId={"" + element.itemId} label={element.label} />
                                                <Button startIcon={<DeleteIcon />} onClick={() => setActiveLayer(i)}></Button>
                                            </Box>
                                            : <></>
                                    )
                                )
                            })}
                        </SimpleTreeView>
                    </Box>
                </CustomTabPanel>
            </Popover>
            <Button size="large" startIcon={<SearchIcon sx={{ minBlockSize: '50px' }} />} aria-describedby={searchId} onClick={handleSearchClick} />
            <Popover sx={{ maxHeight: '400px' }}
                id={searchId}
                open={searchOpen}
                anchorEl={searchAnchorEl}
                onClose={handleSearchClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                    >
                        {nations.map((element, i) => {
                            return (
                                <Box key={i} flexDirection="row" sx={{ display: "flex", justifyContent: 'space-between' }}>
                                    <div onClick={() => handleRadioButtonClick(element.coordinate)} style={{ display: "flex" }}>
                                        <FormControlLabel value={element.nation} control={<Radio />} label={element.nation} />
                                    </div>
                                </Box>
                            )
                        })}
                    </RadioGroup>
                    <br />
                    <TextField
                        label="Enter coordinates"
                        variant="outlined"
                        fullWidth
                        value={coordinate}
                        onChange={handleCoordinateChange}
                        onKeyPress={handleKeyPress}
                        placeholder="ex. 41.8719, 12.5674"
                    />
                </Box>
            </Popover>

            <Button size="large" startIcon={<AspectRatioIcon sx={{ minBlockSize: '50px' }} />} onClick={props.resizeMap} />
        </div >
    );
};




// <Checkbox defaultChecked={activeLayers.find(e => { return e.id == element.id }) != null}></Checkbox><TreeItem itemId="sub-subtree-land" label="Land Cover 2019 (raster 100 m), global, yearly – version 3" onClick={(evt) => setActiveLayer(evt.target)} />
/*
import React from "react";
import DehazeIcon from '@mui/icons-material/Dehaze';
import { Box, Button, Checkbox, Popover, Tab, Tabs } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { treeItems } from "./layers";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface InfoLayerProps {
    setTiles: (tiles: boolean[]) => void;
    tiles: boolean[];
    changeLayerOrder: (oldIndex: number, newIndex: number) => void;
}

export default function InfoLayer(props: InfoLayerProps) {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [searchAnchorEl, setSearchAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [coordinates, setCoordinates] = useState<string>(""); // Stato per le coordinate inserite


    const setActiveLayer = (i: number) => {
        const updatedTiles = props.tiles.slice();
        updatedTiles[i] = !props.tiles[i];
        props.setTiles(updatedTiles);
    };

    const moveLayerUp = (index: number) => {
        if (index > 0) {
            props.changeLayerOrder(index, index - 1);
        }
    };

    const moveLayerDown = (index: number) => {
        if (index < props.tiles.length - 1) {
            props.changeLayerOrder(index, index + 1);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSearchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSearchAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchClose = () => {
        setSearchAnchorEl(null);
    };

    const handleCoordinateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCoordinates(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            const coordRegex = /^([-+]?\d{1,2}(?:\.\d+)?)[, ]\s*([-+]?\d{1,3}(?:\.\d+)?)$/;
            const match = coordinates.match(coordRegex);
            if (match) {
                const lat = parseFloat(match[1]);
                const lon = parseFloat(match[2]);
                props.zoomToCoordinates([lon, lat]); // Nota: prima lon poi lat
                handleSearchClose(); // Chiude il popover dopo il zoom
            } else {
                alert("Please enter valid coordinates (Ex. 41.8719, 12.5674)");
            }
        }
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }
    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const open = Boolean(anchorEl);
    const searchOpen = Boolean(searchAnchorEl);
    const id = open ? 'simple-popover' : undefined;
    const searchId = searchOpen ? 'search-popover' : undefined;

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const list = treeItems();

    return (
        <div>
            <Button size="large" startIcon={<DehazeIcon sx={{ minBlockSize: '50px' }} />} aria-describedby={id} onClick={handleClick} />
            <Popover sx={{ maxHeight: '400px' }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Products and datasets" />
                        <Tab label="Active layers" />
                    </Tabs>
                </Box>
                <Box p={2}>
                    {value === 0 ? (
                        <SimpleTreeView>
                            {list.map((element, i) => (
                                <Box key={i} flexDirection="row" sx={{ display: "flex", justifyContent: 'space-between' }}>
                                    <div onClick={() => setActiveLayer(i)} style={{ display: "flex" }}>
                                        <Checkbox checked={props.tiles[i]} />
                                        <TreeItem itemId={element.itemId} label={element.label} />
                                    </div>
                                    {props.tiles[i] && (
                                        <Button startIcon={<DownloadIcon />} />
                                    )}
                                </Box>
                            ))}
                        </SimpleTreeView>
                    ) : (
                        <SimpleTreeView>
                            {list.map((element, i) => (
                                props.tiles[i] && (
                                    <Box key={i} flexDirection="row" sx={{ display: "flex", justifyContent: 'space-between' }}>
                                        <TreeItem itemId={element.itemId} label={element.label} />
                                        <Box>
                                            <Button startIcon={<ArrowUpwardIcon />} onClick={() => moveLayerUp(i)} />
                                            <Button startIcon={<ArrowDownwardIcon />} onClick={() => moveLayerDown(i)} />
                                            <Button startIcon={<DeleteIcon />} onClick={() => setActiveLayer(i)} />
                                        </Box>
                                    </Box>
                                )
                            ))}
                        </SimpleTreeView>
                    )}
                </Box>
            </Popover>
            <Button size="large" startIcon={<SearchIcon sx={{ minBlockSize: '50px' }} />} aria-describedby={searchId} onClick={handleSearchClick} />
            <Popover
                id={searchId}
                open={searchOpen}
                anchorEl={searchAnchorEl}
                onClose={handleSearchClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            > */