import Typography from "@mui/material/Typography";
import ApiIcon from '@mui/icons-material/Api';
import Box from "@mui/material/Box";
import SearchButton from "./_component/SearchButton.tsx";

export default function Layout() {
    return (
        <>
            <BlogHeader />
            <main className={"w-screen"}>
                {
                    Array.from({length: 10}).map((_, i) => (
                        <div key={i} className={"w-full h-96 odd:bg-pink-400 even:bg-green-400"}/>
                    ))
                }
            </main>
        </>
    );
}

function BlogHeader() {
    return (
        <Box
            component="header" sx={{color: "text.primary"}}
            className={"sticky top-0 left-0 w-full bg-transparent backdrop-blur z-40 p-4 flex gap-8 items-center"}
        >
            <Box className={"flex items-center gap-4 cursor-pointer"}>
                <ApiIcon />
                <Typography variant={"h6"}>
                    I'm Kevin !
                </Typography>
            </Box>
            <Box className={"flex items-center gap-6"} sx={{color: "text.secondary"}}>
                <Typography variant={"subtitle1"}>
                    Blog
                </Typography>
                <Typography variant={"subtitle1"}>
                    Driver
                </Typography>
                <Typography variant={"subtitle1"}>
                    Others
                </Typography>
            </Box>
            <Box className={"flex-1 flex justify-center items-center"}>
                <SearchButton />
            </Box>
        </Box>
    )
}