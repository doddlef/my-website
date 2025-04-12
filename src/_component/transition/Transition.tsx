import { motion } from "motion/react";
import React from "react";

const calculateDelay = (row: number, col: number, totalRows: number) => {
    const rowDelay = (totalRows - row - 1) * 0.05;
    const colDelay = col * 0.02;
    const randomOffset = Math.random() * 0.2;
    return rowDelay + colDelay + randomOffset;
};

const Transition = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}

            <div className={"fixed top-0 left-0 w-screen h-screen flex flex-col pointer-events-none z-50"}>
                {Array.from({length: 10}).map((_, row) => (
                    <div key={row} className={"flex-1 w-full flex"}>
                        {Array.from({length: 11}).map((_, col) => (
                            <motion.div
                                className={"relative flex-1 -ml-0.5 origin-top bg-gray-200 dark:bg-slate-900"}
                                key={col}
                                initial={{scaleY: 1}}
                                animate={{scaleY: 0}}
                                exit={{scaleY: 0}}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: calculateDelay(row, col, 10),
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className={"fixed top-0 left-0 w-screen h-screen flex flex-col pointer-events-none z-50"}>
                {Array.from({length: 10}).map((_, row) => (
                    <div key={row} className={"flex-1 w-full flex"}>
                        {Array.from({length: 11}).map((_, col) => (
                            <motion.div
                                className={"relative flex-1 -ml-0.5 origin-bottom bg-gray-200 dark:bg-slate-900"}
                                key={col}
                                initial={{scaleY: 0}}
                                animate={{scaleY: 0}}
                                exit={{scaleY: 1}}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: calculateDelay(row, col, 10),
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Transition;