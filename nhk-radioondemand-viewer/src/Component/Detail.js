import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Box from '@material-ui/core/Box';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';

import moment from 'moment';

const columns = [

    { field: 'headline_id', headerName: 'headline_id', type: 'string', width: 100, },
    { field: 'headline', headerName: 'headline', type: 'string', width: 80, },
    { field: 'headline_sub', headerName: 'headline_sub', type: 'string', width: 80, },
    {
        field: 'headline_image', headerName: 'headline_image', type: 'string', width: 80,
        renderCell: ({ value }) => (<a href={value}><img src={value} /></a>),
    },

    { field: 'seq', headerName: 'file_list.seq', type: 'string', width: 200, },
    { field: 'file_id', headerName: 'file_list.file_id', type: 'string', width: 200, },
    { field: 'file_title', headerName: 'file_list.file_title', type: 'string', width: 200, },
    { field: 'file_title_sub', headerName: 'file_list.file_title_sub', type: 'string', width: 200, },
    { field: 'file_name', headerName: 'file_list.file_name', renderCell: ({ value }) => (<a href={value}>link</a>), type: 'string', width: 200, },
    { field: 'open_time', headerName: 'file_list.open_time', valueFormatter: ({ value }) => moment(value).format(), type: 'string', width: 200, },
    { field: 'close_time', headerName: 'file_list.close_time', valueFormatter: ({ value }) => moment(value).format(), type: 'string', width: 200, },
    { field: 'onair_date', headerName: 'file_list.onair_date', type: 'string', width: 200, },
    { field: 'share_url', headerName: 'file_list.share_url', renderCell: ({ value }) => (<a href={value}>link</a>), type: 'string', width: 200, },
    { field: 'aa_contents_id', headerName: 'file_list.aa_contents_id', type: 'string', width: 200, },
    { field: 'aa_measurement_id', headerName: 'file_list.aa_measurement_id', type: 'string', width: 200, },
    { field: 'aa_vinfo1', headerName: 'file_list.aa_vinfo1', type: 'string', width: 200, },
    { field: 'aa_vinfo2', headerName: 'file_list.aa_vinfo2', type: 'string', width: 200, },
    { field: 'aa_vinfo3', headerName: 'file_list.aa_vinfo3', type: 'string', width: 200, },
    { field: 'aa_vinfo4', headerName: 'file_list.aa_vinfo4', type: 'string', width: 200, },
    {
        field: 'ffmpegCommandLine', headerName: 'ffmpeg command line', type: 'string', width: 200,
        renderCell: (params) => <FileCopyIcon variant="contained" color="primary" onClick={() => onClickCopyFfmpegCommandLine(params.value)} />
    },
];

const useStyles = makeStyles((theme) => ({
    root: {
        width: '1000',
    },
    headerGrid: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '20',
    },
    dataGrid: {
        width: '100%',
        height: 500,
    },
    title: {
        padding: '0.2em 0.5em',
        margin: 0,
    },
}));


const makeFfmpegCommandLine = (programName, file) => {
    const datetimes = file.aa_vinfo4.split('_');
    const start = new Date(datetimes[0]);
    const end = new Date(datetimes[1]);
    const duration = (end - start) / 1000 - 1; // [秒]
    const command = [
        `ffmpeg`,
        `-t ${duration}`,
        `-y -i ${file.file_name.split('?')[0]}`,
        `-metadata genre="ラジオ"`,
        `-metadata album_artist=""`,
        `-metadata title="${file.file_title}"`,
        `-metadata album="${programName}"`,
        `-metadata date="${moment(start).format("YYYY-MM-DD HH:mm:ss")}"`,
        `-metadata comment="${file.file_title_sub}"`,
        `-c copy "${programName}（${moment(start).format("YYYYMMDD_HHmmss")}）.m4a"`
    ];

    return command.join(' ');
}

const onClickCopyFfmpegCommandLine = (aaa) => {
    navigator.clipboard.writeText(aaa);
}

function Detail(props) {
    const classes = useStyles();

    const { isOpen, url, onClose } = props;

    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState(null);
    const [contents, setContexts] = useState([]);

    useEffect(() => {
        (async () => {
            if (url == null) {
                return;
            }

            const detail = await fetch(url)
                .then(response => {
                    return response.text();
                })
                .then(text => {
                    return JSON.parse(text);
                })
                .catch((error) => {
                    console.error(error)
                })

            setDetail(detail);
        })();
    }, [url]);

    useEffect(() => {
        if (detail == null || detail.main == null) {
            return;
        }

        // file_list の長さを 1 で決め打ちしているのでチェックする。
        let isFileListLengthOne = true;
        detail.main.detail_list.forEach(x => {
            isFileListLengthOne = isFileListLengthOne && (x.file_list.length === 1);
        })
        if (!isFileListLengthOne) {
            alert('main.detail_list.file_list.length !== 1')
        }

        setTitle(detail.main.program_name);

        let contents = [];
        for (const key in detail.main) {
            switch (key) {
                case 'detail_list':
                    const detailList = detail.main.detail_list.map((x, i) => {
                        // DataGrid で扱うのに ID を付加してやる。
                        return {
                            ...x,
                            ...x.file_list[0],
                            id: i,
                            ffmpegCommandLine: makeFfmpegCommandLine(detail.main.program_name, x.file_list[0])
                        }
                    });

                    const datagrid = (
                        <Box className={classes.dataGrid}>
                            <DataGrid
                                rows={detailList}
                                columns={columns}
                                disableColumnMenu={true}
                                headerHeight={30}
                                rowHeight={30}
                                pagination
                                pageSize={100}
                                rowsPerPageOptions={[100]}
                                hideFooterSelectedRowCount={true}
                            />
                        </Box>
                    );

                    contents.push(<li id={key}>{key} : {datagrid}</li>);
                    break;

                case 'thumbnail_p':
                case 'thumbnail_c':
                    contents.push(<li id={key}>{key} : <a href={detail.main[key]}><img src={detail.main[key]} /></a></li>);
                    break;

                case 'official_url':
                case 'share_url':
                    contents.push(<li id={key}>{key} : <a href={detail.main[key]}>link</a></li>);
                    break;

                case 'dev':
                    contents.push(<li id={key}>{key} : {moment(detail.main[key]).format()}</li>);
                    break;

                default:
                    contents.push(<li id={key}>{key} : {detail.main[key]}</li>);
                    break;
            }
        }
        setContexts(contents);
    }, [detail]);

    return (
        <Box container className={classes.root}>
            <Dialog onClose={onClose} open={isOpen} fullWidth={true} maxWidth={false}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box>
                            <ul>{contents}</ul>
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default Detail;
