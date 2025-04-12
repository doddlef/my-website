import {usePagination} from "../../_middleware/(Explorer)/Pagination/PaginationContext.ts";
import UploadHelper from "../UploadHelper/UploadHelper.tsx";

export default function UploadHelperWrapper() {
    const { currentFolder } = usePagination();
    return <UploadHelper folder={currentFolder} />
}