import styles from "./Test.module.css"
import {clsx} from "clsx";

export default function Layout() {
    return (
        <main className={"w-screen h-screen bg-gray-200"}>
            <h5>Hello world !</h5>
            <div className={clsx(styles.overlay)} />
        </main>
    );
}