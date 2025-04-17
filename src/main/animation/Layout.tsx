import Button from "@mui/material/Button";

export default function Layout() {
    return (
        <main className="w-screen h-screen bg-gray-200 p-2 text-black">
            <LabelSlot />
        </main>
    );
}

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';

type TreeItemWithLabel = {
    id: string;
    label: string;
    secondaryLabel?: string;
};

const MUI_X_PRODUCTS: TreeViewBaseItem<TreeItemWithLabel>[] = [
    {
        id: 'grid',
        label: 'Data Grid',
        children: [
            {
                id: 'grid-community',
                label: '@mui/x-data-grid',
                secondaryLabel: 'Community package',
            },
            {
                id: 'grid-pro',
                label: '@mui/x-data-grid-pro',
                secondaryLabel: 'Pro package',
            },
            {
                id: 'grid-premium',
                label: '@mui/x-data-grid-premium',
                secondaryLabel: 'Premium package',
            },
        ],
    },
    {
        id: 'pickers',
        label: 'Date and Time pickers',

        children: [
            {
                id: 'pickers-community',
                label: '@mui/x-date-pickers',
                secondaryLabel: 'Community package',
            },
            {
                id: 'pickers-pro',
                label: '@mui/x-date-pickers-pro',
                secondaryLabel: 'Pro package',
            },
        ],
    },
    {
        id: 'charts',
        label: 'Charts',

        children: [{ id: 'charts-community', label: '@mui/x-charts' }],
    },
    {
        id: 'tree-view',
        label: 'Tree View',
        children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
    },
];

interface CustomLabelProps {
    children: string;
    className: string;
    secondaryLabel: string;
}

function CustomLabel({ children, className, secondaryLabel }: CustomLabelProps) {
    return (
        <Button className={className} onClick={(e) => {
            e.stopPropagation();
            console.log(children);
        }}>
            <Typography>{children}</Typography>
            {secondaryLabel && (
                <Typography variant="caption" color="secondary">
                    {secondaryLabel}
                </Typography>
            )}
        </Button>
    );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: TreeItem2Props,
    ref: React.Ref<HTMLLIElement>,
) {
    const { publicAPI } = useTreeItem2Utils({
        itemId: props.itemId,
        children: props.children,
    });

    const item = publicAPI.getItem(props.itemId);

    return (
        <TreeItem2
            {...props}
            ref={ref}
            slots={{
                label: CustomLabel,
            }}
            slotProps={{
                label: { secondaryLabel: item?.secondaryLabel || '' } as CustomLabelProps,
            }}
        />
    );
});

function LabelSlot() {
    return (
        <Box sx={{ minHeight: 200, minWidth: 350 }}>
            <RichTreeView
                defaultExpandedItems={['pickers']}
                items={MUI_X_PRODUCTS}
                slots={{ item: CustomTreeItem }}
            />
        </Box>
    );
}