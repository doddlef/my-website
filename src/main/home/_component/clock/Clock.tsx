import { motion } from "motion/react";
import "../../../../_fonts/tektur.css";
import useClock from "./useClock.ts";
import { useTheme } from "@mui/material/styles";

const HOUR_TEN = [0, 1, 2];
const MINUTE_TEN = [0, 1, 2, 3, 4, 5]
const TEN_NUMBER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Clock() {
    const theme = useTheme(); // Only call useTheme() once
    const primaryColor = theme.palette.primary.main;
    const secondaryColor = theme.palette.secondary.light;

    const { hours, minutes, seconds } = useClock();

    return (
        <motion.div
            className="flex flex-row items-end tektur text-2xl font-bold gap-4"
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, type: "easeOut" }}
        >
            <ClockCol list={HOUR_TEN} matcher={~~(hours / 10)} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <ClockCol list={TEN_NUMBER} matcher={hours % 10} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <span style={{ color: "lightblue", fontWeight: 800 }} className="text-4xl">:</span>
            <ClockCol list={MINUTE_TEN} matcher={~~(minutes / 10)} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <ClockCol list={TEN_NUMBER} matcher={minutes % 10} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <span style={{ color: "lightblue", fontWeight: 800 }} className="text-4xl">:</span>
            <ClockCol list={MINUTE_TEN} matcher={~~(seconds / 10)} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <ClockCol list={TEN_NUMBER} matcher={seconds % 10} primaryColor={primaryColor} secondaryColor={secondaryColor} />
        </motion.div>
    );
}

function ClockCol({ list, matcher, primaryColor, secondaryColor, className }:
                  { list: number[], matcher: number, primaryColor: string, secondaryColor: string, className?: string }) {
    return (
        <ul className={className}>
            {list.map((i) => (
                <ClockNode
                    number={i}
                    check={i === matcher}
                    key={i}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                />
            ))}
        </ul>
    );
}

function ClockNode({ number, check, primaryColor, secondaryColor }: { number: number, check: boolean, primaryColor: string, secondaryColor: string }) {
    return (
        <motion.li
            initial={false}
            animate={{
                rotate: check ? `${number % 3}deg` : "90deg",
                color: check ? primaryColor : secondaryColor,
                scale: check ? 1.4 : 1,
            }}
            transition={{ duration: 0.4 }}
        >
            {number}
        </motion.li>
    );
}