import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import React from "react";
import usePagination from "../../_hooks/usePagination.ts";

function PaginationHeader() {
    const { page, pageCount, changePage } = usePagination();

    const handleChangePage = (
        _: React.ChangeEvent<unknown>,
        newPage: number,
    ) => {
        console.log(newPage);
        changePage(newPage);
    };

    return (
        <Paper className={"pl-4 p-2 flex justify-center items-center"} elevation={2} sx={{borderRadius: 4}}>
            <Pagination
                showFirstButton
                showLastButton
                color={"primary"}
                size={"small"}
                siblingCount={1}
                boundaryCount={0}
                count={pageCount}
                page={page}
                onChange={handleChangePage}
            />
        </Paper>
    );
}

export default PaginationHeader;