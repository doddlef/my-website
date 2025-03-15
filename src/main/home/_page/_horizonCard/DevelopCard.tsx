import {CardPage} from "../HorizonPage.tsx";
import {ContentTyp} from "../../_component/CustomType.tsx";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export default function DevelopCard() {
    return (
        <CardPage className={"flex justify-center items-center"}>
            <Paper elevation={4} className={"p-4 relative flex gap-2"}>
                <Stack spacing={2} className="max-w-sm">
                    <Typography variant="h3" component="div" fontFamily="Sour gummy" color="primary.main">
                        Development
                    </Typography>
                    <ContentTyp>
                        As I mentioned before, programming is really enjoyable,
                        which is why I keep learning and building projects outside of class.
                        Over time, I have tried from simple Pygame, Javafx media player, to chess AI, and, of course,
                        Web application
                    </ContentTyp>
                    <ContentTyp>
                        There's something exciting about coming up with an idea and bringing it to life through code.
                        However, the excitement often turns into frustration when a project drags on endlessly.
                        As a solo developer, managing everything—from design and implementation to testing—can be exhausting.
                        It's even more frustrating when, after days of researching, learning, and coding,
                        I discover a better approach that makes my previous work feel 'trash''.
                        Because of this, many of my personal projects end up abandoned midway.
                    </ContentTyp>
                </Stack>
                <div className={"hidden md:flex flex-col items-center justify-center gap-4 max-w-lg"}>
                    <div className={"p-1 rounded bg-gray-400 hover:shadow-lg transition-shadow duration-500"}>
                        <img src={"/project/ezon_1.png"} alt={""}/>
                    </div>
                    <Typography variant={"body2"} fontFamily={"Pacifico"} color={"text.secondary"}>
                        My first Web application
                    </Typography>
                    <Typography sx={{textDecorationLine: "underline"}} variant={"body2"}
                                fontFamily={"Sour gummy"} color={"text.secondary"}>
                        more projects?
                    </Typography>
                </div>
            </Paper>
        </CardPage>
    );
}