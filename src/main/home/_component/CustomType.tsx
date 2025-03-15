import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const ContentTyp = styled(Typography)(({ theme }) => ({
    fontFamily: "Sour gummy",
    color: theme.palette.text.primary,
    [theme.breakpoints.down("sm")]: {
        variant: "body2",
    },
    [theme.breakpoints.up("md")]: {
        variant: "body1",
    },
})) as typeof Typography;

export const HeightContent = styled((props) => <Typography component="span" {...props} />)(({theme}) => ({
    color: theme.palette.success.main,
    textDecorationLine: "underline",
    display: "inline",
    fontFamily: "Sour gummy",
    [theme.breakpoints.down("sm")]: {
        variant: "body2",
    },
    [theme.breakpoints.up("md")]: {
        variant: "body1",
    },
})) as typeof Typography;