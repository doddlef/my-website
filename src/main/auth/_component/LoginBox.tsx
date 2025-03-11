import {useCallback, useState} from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ThemeSwitch from "../../_component/ThemeSwitch.tsx";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import {localLogin} from "../_lib/actions.ts";
import {useAccount} from "../../../_component/accountProvider/AccountContext.tsx";

export default function LoginBox({register} : {register: () => void}) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {setAccount} = useAccount();

    const login = useCallback(async () => {
        try {
            const result = await localLogin(email, password);
            if (result.code === 0 && result.fields) {
                setAccount(result.fields.account);
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage((error as Error).message);
        }

    }, [email, password, setAccount])

    return (
        <Stack spacing={2} component={"div"}>
            <div className={"flex items-center justify-between"}>
                <Box>
                    <Typography variant={"h5"} sx={{color: "text.primary"}} gutterBottom>
                        Sign in to your account
                    </Typography>
                    <Typography variant={"body2"} sx={{color: "text.secondary"}} gutterBottom>
                        Don't have an account?
                        <Typography component={"a"} sx={{color: "info.main"}}
                                    onClick={() => register()}
                                    className={"inline hover:underline cursor-pointer pl-1"}>
                            register now.
                        </Typography>
                    </Typography>
                </Box>
                <ThemeSwitch/>
            </div>
            {errorMessage &&
                <Alert variant="filled" severity="error" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            }
            <form onSubmit={e => {e.preventDefault(); login();}}>
                <Stack spacing={2}>
                    <TextField label={"email"} type={"email"} name={"email"} value={email}
                               onChange={e => setEmail(e.target.value)}
                               fullWidth required/>
                    <TextField label={"password"} type={showPassword ? "text" : "password"} name={"password"}
                               onChange={e => setPassword(e.target.value)}
                               value={password} fullWidth
                               slotProps={{
                                   input: {
                                       endAdornment: (
                                           <InputAdornment position={"end"}
                                                           className={"cursor-pointer"}
                                                           onClick={() => setShowPassword(!showPassword)}
                                           >
                                               {showPassword ? <VisibilityOff/> : <Visibility/>}
                                           </InputAdornment>
                                       )
                                   }
                               }}
                               required
                    />
                    <Button type={"submit"} variant={"contained"}
                            sx={{p: "5px", fontSize: "1.2rem", fontWeight: "400"}}>
                        Sign in
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}