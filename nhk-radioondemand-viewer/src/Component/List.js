import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import moment from 'moment';

const url = `https://www.nhk.or.jp/radioondemand/json/index_v3/index.json`;

const columns = [
    { field: 'site_id', headerName: 'site_id', type: 'string', width: 100, },
    { field: 'program_name', headerName: 'program_name', type: 'string', width: 200, },
    { field: 'program_name_kana', headerName: 'program_name_kana', type: 'string', width: 200, },
    { field: 'media_code', headerName: 'media_code', type: 'string', width: 100, },
    { field: 'corner_id', headerName: 'corner_id', type: 'string', width: 100, },
    { field: 'corner_name', headerName: 'corner_name', type: 'string', width: 200, },
    {
        field: 'thumbnail_p', headerName: 'thumbnail_p', type: 'string', width: 200,
        renderCell: ({ value }) => (<a href={value}><img src={value} /></a>),
    },
    {
        field: 'thumbnail_c', headerName: 'thumbnail_c', type: 'string', width: 200,
        renderCell: ({ value }) => (<a href={value}><img src={value} /></a>),
    },
    { field: 'open_time', headerName: 'open_time', valueFormatter: ({ value }) => moment(value).format(), type: 'string', width: 200, },
    { field: 'close_time', headerName: 'close_time', valueFormatter: ({ value }) => moment(value).format(), type: 'string', width: 200, },
    { field: 'onair_date', headerName: 'onair_date', type: 'string', width: 200, },
    { field: 'link_url', headerName: 'link_url', type: 'string', width: 200, },
    { field: 'start_time', headerName: 'start_time', valueFormatter: ({ value }) => moment(value).format(), type: 'string', width: 200, },
    { field: 'update_time', headerName: 'update_time', valueFormatter: ({ value }) => moment(value).format(), type: 'string', width: 200, },
    { field: 'dev', headerName: 'dev', valueFormatter: ({ value }) => moment(value).format(), type: 'string', width: 200, },
    {
        field: 'detail_json', headerName: 'detail_json', type: 'string', width: 200,
        renderCell: ({ value }) => (<a href={value}>link</a>),
    },
];

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100vw',
        height: '100vh'
    },
    headerGrid: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '20',
    },
    dataGrid: {
        position: 'absolute',
        top: 100,
        left: 0,
        width: '100%',
        height: 'calc(100% - 100px)',
    },
    title: {
        padding: '0.2em 0.5em',
        margin: 0,
    },
    formControl: {
        padding: '0.2em 1.0em',
        margin: 0,
    }
}));


function List() {
    const classes = useStyles();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);

            const index = await fetch(url)
                .then(response => {
                    return response.text();
                })
                .then(text => {
                    return JSON.parse(text);
                })
                .catch((error) => {
                    console.error(error)
                })

            setItems(index.data_list.map((x, i) => { return { ...x, id: i } }));    // DataGrid で扱うのに ID を付加してやる。

            setLoading(false);
        })();
    }, []);

    return (
        <Grid container spacing={0} className={classes.root}>
            <Grid item xs={12} className={classes.headerGrid} >
                <h1 className={classes.title}>NHK radio on demand</h1>

                {/* <FormControl className={classes.formControl}>
                    <Select
                        labelId="select-type-label"
                        id="select-type"
                        value={filter}
                        onChange={e => { setFilter(e.target.value) }}
                    >
                        {types.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </Select>
                </FormControl> */}
            </Grid>
            <Grid item xs={12} className={classes.dataGrid}>
                <DataGrid
                    rows={items}
                    columns={columns}
                    disableColumnMenu={true}
                    headerHeight={30}
                    rowHeight={30}
                    pagination
                    autoPageSize={true}
                    loading={loading}
                    hideFooterSelectedRowCount={true}
                />
            </Grid>
        </Grid>
    );
}

export default List;
