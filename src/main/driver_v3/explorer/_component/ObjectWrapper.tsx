import { ItemView } from "../../definitions.ts";
import { NavigateFunction } from "react-router-dom";
import React, { useMemo } from "react";
import {useDrag, useDrop} from "react-dnd";
import {enqueueSnackbar} from "notistack";
import useSelected from "../../_middleware/useSelected/useSelected.ts";
import usePreview from "../_hooks/usePreview.ts";
import useFolderTree from "../../_middleware/useFolderTree/useFolderTree.ts";
import ObjectIcon from "../../_component/ObjectIcon.tsx";
import {moveItems} from "../../apis.ts";
import useFolderContent from "../_hooks/useFolderContent.ts";

const DRAG_TYPE = "ITEM_WRAPPER";

type DragItem = {
    id: number;
    type: "ITEM_WRAPPER";
};

type ObjectIconProps = {
    item: ItemView;
    navigate: NavigateFunction;
    itemMenu: (anchor: HTMLElement) => void;
};

function ObjectWrapper({ item, navigate, itemMenu }: ObjectIconProps) {
    const { selected, select, add, deselect, clear } = useSelected();
    const { preview } = usePreview();
    const { update } = useFolderTree();
    const isSelected = useMemo(() => selected.has(item.id), [item.id, selected]);

    /****************************handler part*****************************/

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
            if (isSelected) deselect(item.id);
            else add(item.id);
        }
        else select(item.id);
    };

    const handleDoubleClick = () => {
        if (item.folder) navigate(`/driver?folder=${item.id}`);
        else preview(item.id);
        clear();
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        select(item.id);
        itemMenu(e.currentTarget);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleDoubleClick();
        }
    };

    const { remove } = useFolderContent();
    const handleMove = (children: number, folder: number) => {
        deselect(children);
        deselect(folder);

        moveItems([children], folder)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar(r.message, {variant: "success"});
                    update(children, {folderId: folder});
                    remove(children);
                } else {
                    enqueueSnackbar(r.message, {variant: "error"});
                }
            })
            .catch(console.error);
    }

    /**************************** dnd part*****************************/

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

    /****************************render part*****************************/

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
                disableEditIcon={selected.size > 0}
            />
        </div>
    );
}

export default ObjectWrapper;