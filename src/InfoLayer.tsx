import React from "react";
import DehazeIcon from '@mui/icons-material/Dehaze';
import { Box, Button, Checkbox, Popover, Tab, Tabs } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { treeItems } from "./layers";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

export default function InfoLayer(props: any) {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const setActiveLayer = (i: number) => {
        if (props.tiles[i]) {
            props.setTiles(props.tiles.slice(0, i).concat([false].concat(props.tiles.slice(i + 1))));
        } else {
            props.setTiles(props.tiles.slice(0, i).concat([true].concat(props.tiles.slice(i + 1))));
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
    const id = open ? 'simple-popover' : undefined;

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
                                                    <Button startIcon={<DeleteIcon/>} onClick={() => setActiveLayer(i)}></Button>
                                                </Box>
                                             : <></>
                                    )
                                )
                            })}
                        </SimpleTreeView>
                    </Box>
                </CustomTabPanel>
            </Popover>
        </div>
    );
};

// <Checkbox defaultChecked={activeLayers.find(e => { return e.id == element.id }) != null}></Checkbox><TreeItem itemId="sub-subtree-land" label="Land Cover 2019 (raster 100 m), global, yearly – version 3" onClick={(evt) => setActiveLayer(evt.target)} />