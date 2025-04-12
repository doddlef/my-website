import {ItemView} from "../../definations.ts";
import {NavigateFunction} from "react-router-dom";
import {useMemo} from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {useItemPreview} from "../../_middleware/(Explorer)/ItemPreview/ItemPreviewContext.ts";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import Checkbox from "@mui/material/Checkbox";
import {formatFileSize, formatSmartDate, getViewPicture} from "../../_lib/utils.ts";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type ObjectRowProps = {
    item: ItemView;
    navigate: NavigateFunction;
    itemMenu: (anchor: HTMLElement) => void;
}

export default function ObjectRow({item, navigate, itemMenu}: ObjectRowProps) {
    const { selected, select, add } = useSelected();
    const { previewFile } = useItemPreview();
    const isSelected = useMemo(() => selected.some(i => i.id === item.id), [item.id, selected]);

    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            hover
            onClick={(e) => {
                e.stopPropagation();
                if (e.ctrlKey || e.metaKey) add(item);
                else select(item);
            }}
            onDoubleClick={(e) => {
                e.preventDefault();
                if (item.folder) navigate(`/driver?folder=${item.id}`);
                else previewFile(item.id);
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                select(item);
                itemMenu(e.currentTarget);
            }}
        >
            <TableCell sx={{ width: '5%' }}>
                <Checkbox checked={isSelected} color={"primary"} />
            </TableCell>

            <TableCell sx={{ width: '5%' }}>
                <img src={getViewPicture(item.fileType)} alt="" className={"w-6 h-6"} />
            </TableCell>

            <TableCell sx={{ width: '45%', overflow: 'hidden' }}>
                <Typography
                    noWrap
                    variant="subtitle1"
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    {item.name}
                </Typography>
            </TableCell>

            <TableCell sx={{ width: '10%' }}>
                <IconButton onClick={(e) => {
                    e.stopPropagation();
                    select(item);
                    itemMenu(e.currentTarget);
                }}>
                    <MoreVertIcon />
                </IconButton>
            </TableCell>

            <TableCell align="left" sx={{ width: '20%' }}>
                <Typography variant="body1" noWrap>
                    {formatSmartDate(item.editedAt)}
                </Typography>
            </TableCell>

            <TableCell align="left" sx={{ width: '15%' }}>
                <Typography variant="body1" noWrap>
                    {item.size ? formatFileSize(item.size) : '-'}
                </Typography>
            </TableCell>
        </TableRow>
    )
}