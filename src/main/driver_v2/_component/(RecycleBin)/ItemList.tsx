import useRecycleBin from "../../_middleware/(RecycleBin)/useRecycleBin/useRecycleBin.ts";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import {BinItemView} from "../../definations.ts";
import {useCallback, useMemo, useState} from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import RecycleMenu from "./RecycleMenu.tsx";
import ObjectWrapper from "./ObjectWrapper.tsx";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

function getGroupLabel(dateString: string): string {
    const date = dayjs(dateString);
    if (date.isToday()) return "Today";
    if (date.isYesterday()) return "Yesterday";
    return date.format("MMM D");
}

function groupByDate(items: BinItemView[]): Record<string, BinItemView[]> {
    const groups: Record<string, BinItemView[]> = {};
    for (const item of items) {
        const label = getGroupLabel(item.deletedAt);
        if (!groups[label]) {
            groups[label] = [];
        }
        groups[label].push(item);
    }
    return groups;
}

export default function ItemList() {
    const { items } = useRecycleBin();
    const { clear } = useSelected();
    const grouped = useMemo(() => groupByDate(items), [items]);

    const [itemMenuEl, setItemMenuEl] = useState<HTMLElement | null>(null);
    const itemMenuOpen = useMemo(() => Boolean(itemMenuEl), [itemMenuEl]);
    const handleItemMenuClose = useCallback(() => {
        setItemMenuEl(null);
    }, []);
    const itemMenu = useCallback((anchor: HTMLElement) => {
        setItemMenuEl(anchor);
    }, [])

    return (
        <div
            className={"w-full min-h-full"}
            onClick={(e) => {
                e.stopPropagation();
                clear();
            }}
        >
            <Grid
                container
                className={"w-full p-4 pb-24"}
                spacing={2}
            >
                {Object.entries(grouped)
                    .sort((a, b) => {
                        const dateA = dayjs(a[1][0].deletedAt);
                        const dateB = dayjs(b[1][0].deletedAt);
                        return dateB.valueOf() - dateA.valueOf(); // Newest first
                    })
                    .map(([date, items]) => (
                        <>
                            <Grid key={`header_${date}`} size={12}>
                                <Typography variant="h6">{date}</Typography>
                            </Grid>
                            {items.map((item) => (
                                <Grid key={`item_${item.id}`} size={3}>
                                    <ObjectWrapper item={item} itemMenu={itemMenu} />
                                </Grid>
                            ))}
                        </>
                    ))}
                <RecycleMenu open={itemMenuOpen} onClose={handleItemMenuClose} anchorEl={itemMenuEl} />
            </Grid>
        </div>
    );
}