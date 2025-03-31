import SearchIcon from '@mui/icons-material/Search';
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey';
import {useEffect} from "react";

export default function SearchButton() {

    useEffect(() => {

    }, []);

    return (
        <div className={"p-1 pl-2 pr-2 border border-slate-950 rounded-lg bg-gray-200 cursor-pointer bg-opacity-25 flex items-center gap-4"}>
            <SearchIcon />
            <div>Search now...</div>
            <div className={"p-1 flex gap-1 text-sm"}>
                <KeyboardCommandKeyIcon fontSize={"small"}/> K
            </div>
        </div>
    )
}