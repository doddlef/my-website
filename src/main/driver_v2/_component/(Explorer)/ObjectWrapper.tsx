import { ItemView } from "../../definations.ts";
import { NavigateFunction } from "react-router-dom";
import { useItemPreview } from "../../_middleware/(Explorer)/ItemPreview/ItemPreviewContext.ts";
import React, { useMemo } from "react";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import ObjectIcon from "../ObjectIcon.tsx";
import {useDrag, useDrop} from "react-dnd";
import {moveItems} from "../../_api/CoreApi.ts";
import {enqueueSnackbar} from "notistack";

const DRAG_TYPE = "ITEM_WRAPPER";

type DragItem = {
    id: number;
    type: "ITEM_WRAPPER";
};

type ObjectIconProps = {
    item: ItemView;
    navigate: NavigateFunction;
    itemMenu: (anchor: HTMLElement) => void;
    removeItem: (id: number) => void;
};

export default function ObjectWrapper({ item, navigate, itemMenu, removeItem }: ObjectIconProps) {
    const { selected, select, add, deselect, clear } = useSelected();
    const { previewFile } = useItemPreview();
    const isSelected = useMemo(() => selected.some(i => i.id === item.id), [item.id, selected]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
            if (isSelected) deselect(item.id);
            else add(item);
        }
        else select(item);
    };

    const handleDoubleClick = () => {
        if (item.folder) navigate(`/driver?folder=${item.id}`);
        else previewFile(item.id);
        clear();
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        select(item);
        itemMenu(e.currentTarget);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleDoubleClick();
        }
    };

    const handleMove = (children: number, folder: number) => {
        deselect(children);
        deselect(folder);

        moveItems([children], folder)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar(r.message, {variant: "success"});
                    removeItem(children);
                } else {
                    enqueueSnackbar(r.message, {variant: "error"});
                }
            })
            .catch(console.error);
    }

    const [{ isDragging }, dragRef] = useDrag({
        type: DRAG_TYPE,
        item: (): DragItem => ({ id: item.id, type: DRAG_TYPE }),
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop<DragItem>({
        accept: DRAG_TYPE,
        drop: (dragged) => {
            if (dragged.id !== item.id && item.folder) {
                handleMove(dragged.id, item.id);
            }
        },
    });

    const wrapperRef = (el: HTMLDivElement | null) => {
        dragRef(dropRef(el));
    };

    return (
        <div ref={wrapperRef} className={"w-full h-full"} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <ObjectIcon
                handleClick={handleClick}
                handleDoubleClick={handleDoubleClick}
                handleContextMenu={handleContextMenu}
                handleKeyDown={handleKeyDown}
                handleMenuClick={handleContextMenu}

                fileType={item.fileType}
                name={item.name}
                size={item.size}
                time={item.editedAt}

                isSelected={isSelected}
                disableEditIcon={selected.length > 0}
            />
        </div>
    );
}