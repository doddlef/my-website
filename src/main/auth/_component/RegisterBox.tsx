import {useState} from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function RegisterBox({login}: {login: () => void}) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [nickname, setNickname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    return (
        <Stack spacing={2} component={"div"}>
            <Box>
                <Typography variant={"h5"} gutterBottom>
                    Get started absolutely free
                </Typography>
                <Typography variant={"body2"} sx={{color: "text.secondary"}} gutterBottom>
                    Already have an account?
                    <Typography component={"a"} sx={{color: "info.main"}} className={"inline hover:underline cursor-pointer pl-1"} onClick={login}>
                        Get started.
                    </Typography>
                </Typography>
            </Box>
            {errorMessage &&
                <Alert variant="filled" severity="error" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            }
            <Stack spacing={2} component={"form"}
                   onSubmit={(e) => {e.preventDefault()}}
            >
                <TextField label={"nickname"} type={"text"} name={"nickname"} value={nickname}
                           onChange={(e) => setNickname(e.target.value)}
                           fullWidth required
                />
                <TextField label={"email"} type={"email"} name={"email"} value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           fullWidth required
                />
                <TextField label={"password"} type={"password"} name={"password"} value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           fullWidth required/>
                <TextField label={"confirm password"} type={"password"} name={"password"} value={passwordConfirm}
                           onChange={(e) => setPasswordConfirm(e.target.value)}
                           fullWidth required/>
                <Button type={"submit"} variant={"contained"} sx={{p: "5px", fontSize: "1.2rem", fontWeight: "400"}}>
                    Create account
                </Button>
            </Stack>
        </Stack>
    );
}