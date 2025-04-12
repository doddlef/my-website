import {BinItemView} from "../../definations.ts";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import React, {useCallback, useMemo} from "react";
import ObjectIcon from "../ObjectIcon.tsx";

type ObjectIconProps = {
    item: BinItemView;
    itemMenu: (anchor: HTMLElement) => void;
}

export default function ObjectWrapper({item, itemMenu} : ObjectIconProps) {
    const { select, selected, add } = useSelected();
    const isSelected = useMemo(() => selected.some(i => i.id === item.id), [item.id, selected]);

    const handleClick = useCallback((e : React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) add(item)
        else select(item);
    }, [add, item, select])

    const handleContextMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        select(item);
        itemMenu(e.currentTarget);
    }, [item, itemMenu, select])

    return (
        <ObjectIcon
            handleClick={handleClick}
            handleContextMenu={handleContextMenu}
            handleMenuClick={handleContextMenu}

            fileType={item.fileType}
            name={item.name}
            size={item.size}
            time={item.deletedAt}

            isSelected={isSelected}
            disableEditIcon={selected.length > 0}
        />
    )
}