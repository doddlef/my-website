import {UploadApiContext, UploadRequest, UploadTask} from "./UploadApiContext.ts";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { refreshableRequest } from "../../../../../_lib/actions.ts";
import { enqueueSnackbar } from "notistack";
import { R } from "../../../../../_lib/definitions.ts";

const CHUNK_SIZE = 1024 * 1024 - 1;
const MAX_RETRIES = 3;

type InitTaskResult = R & {
    fields: {
        lightening?: boolean;
        taskId?: string;
    }
}

class AbortedError extends Error {}

export default function UploadApiProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<UploadTask[]>([]);
    const md5Worker = useRef<Worker | null>(null);
    const queueProcessing = useRef(false);
    const abortedTasks = useRef(new Set<string>());

    useEffect(() => {
        md5Worker.current = new Worker(new URL("./md5Worker.js", import.meta.url));
        return () => md5Worker.current?.terminate();
    }, []);

    async function calculateMd5(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!md5Worker.current) return reject("MD5 Worker is not initialized");

            const worker = md5Worker.current;

            const handleMessage = (e: MessageEvent) => {
                resolve(e.data);
                worker.removeEventListener("message", handleMessage);
                worker.removeEventListener("error", handleError);
            };

            const handleError = (err: Event) => {
                reject(err);
                worker.removeEventListener("message", handleMessage);
                worker.removeEventListener("error", handleError);
            };

            worker.addEventListener("message", handleMessage);
            worker.addEventListener("error", handleError);
            worker.postMessage(file);
        });
    }

    const updateTask = (taskId: string, changes: Partial<UploadTask>) => {
        setTasks((prev) => prev.map(task => task.id === taskId ? { ...task, ...changes } : task));
    };

    const directlyUpload = useCallback(async (task: UploadTask) => {
        updateTask(task.id, { status: "preparing" });
        const hash = await calculateMd5(task.file);

        updateTask(task.id, { status: "uploading", progress: 0.25 });
        const data = new FormData();
        data.append("name", task.name);
        data.append("extension", task.extension);
        data.append("folder", task.folder.toString());
        data.append("hash", hash);
        data.append("file", task.file);

        if (abortedTasks.current.has(task.id)) throw new AbortedError();

        const result = await refreshableRequest("/api/driver/direct-upload", {
            method: "POST",
            body: data
        });

        if (result.code === 0) {
            updateTask(task.id, { status: "finished", progress: 1 });
            enqueueSnackbar(result.message, { variant: "success" });
        } else {
            updateTask(task.id, { status: "cancelled", progress: 0 });
            enqueueSnackbar(result.message, { variant: "error" });
        }
    }, []);

    const chunkUpload = useCallback(async (task: UploadTask, chunkCount: number, chunkSize: number, taskId: string) => {
        updateTask(task.id, { status: "uploading", progress: 1 / (chunkCount + 2) });

        for (let index = 0; index < chunkCount; index++) {
            let retries = 0;
            while (retries < MAX_RETRIES) {
                if (abortedTasks.current.has(task.id)) throw new AbortedError();

                try {
                    const chunk = task.file.slice(index * chunkSize, index * chunkSize + chunkSize);
                    const data = new FormData();
                    data.append("chunk", chunk);

                    const result = await refreshableRequest(`/api/driver/task/${taskId}/index/${index}`, {
                        method: "POST",
                        body: data,
                    });

                    if (result.code === 0) {
                        updateTask(task.id, { progress: (index + 2) / (chunkCount + 2)});
                        break;
                    } else {
                        console.error(`Chunk ${index} failed:`, result.message);
                        retries++;
                    }
                } catch (error) {
                    console.error(`Chunk ${index} error:`, error);
                    retries++;
                }

                if (retries >= MAX_RETRIES) {
                    updateTask(task.id, { status: "error" });
                    enqueueSnackbar(`Upload failed for ${task.name}`, { variant: "error" });
                    return;
                }
            }
        }
    }, []);

    const taskFinish = useCallback(async (task: UploadTask, taskId: string) => {
        if (abortedTasks.current.has(task.id)) throw new AbortedError();

        const result = await refreshableRequest(`/api/driver/finish/task/${taskId}`, {
            method: "POST",
        });

        if (result.code === 0) {
            updateTask(task.id, { progress: 1, status: "finished" });
            enqueueSnackbar("Upload success", { variant: "success" });
        }
    }, []);

    const chunkTaskInit = useCallback(async (task: UploadTask) => {
        updateTask(task.id, { status: "preparing" });
        // const hash = await calculateMd5(task.file);
        const chunkCount = Math.ceil(task.file.size / CHUNK_SIZE);

        if (abortedTasks.current.has(task.id)) throw new AbortedError();
        // const result = await refreshableRequest("/api/driver/init/task", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         name: task.name,
        //         extension: task.extension,
        //         folder: task.folder,
        //         size: task.file.size,
        //         chunkCount,
        //         chunkSize: CHUNK_SIZE,
        //         hash
        //     })
        // }) as InitTaskResult;

        const result = {code: 0, fields: {lightening: true, taskId: null}}

        if (result.code === 0) {
            if (result.fields.lightening) {
                updateTask(task.id, { status: "finished", progress: 1 });
                enqueueSnackbar("Lightening upload", { variant: "success" });
                return;
            }
            // if (result.fields.taskId) {
            //     await chunkUpload(task, chunkCount, CHUNK_SIZE, result.fields.taskId);
            //     await taskFinish(task, result.fields.taskId);
            //     return;
            // }
        }

        // updateTask(task.id, { status: "cancelled" });
        // enqueueSnackbar(result.message, { variant: "error" });
    }, [chunkUpload, taskFinish]);

    const processNext = useCallback(() => {
        if (queueProcessing.current) return;
        queueProcessing.current = true;

        const process = async () => {
            const task = tasks.find(t => t.status === "waiting");
            console.log(task);
            if (!task) {
                queueProcessing.current = false;
                return;
            }

            try {
                if (task.file.size < CHUNK_SIZE) await directlyUpload(task);
                else await chunkTaskInit(task);
            } catch (error) {
                if (error instanceof AbortedError) {
                    enqueueSnackbar(`Upload aborted`, { variant: "warning" });
                }
            }

            console.log(tasks.map((t) => `${t.name} + ${t.status}`).join("; "))
            setTimeout(process, 0);
        };

        console.log(`process next ${tasks.map((t) => `${t.name} + ${t.status}`).join("; ")}`)
        setTimeout(process, 0);
    }, [tasks, directlyUpload, chunkTaskInit]);

    const cancelTask = useCallback((taskId: string) => {
        abortedTasks.current.add(taskId);

        setTasks(prevTasks => prevTasks.map(task =>
            task.id === taskId ? { ...task, status: "cancelled", progress: 0 } : task
        ));

        enqueueSnackbar(`Task cancelled`, { variant: "warning" });
    }, []);

    const upload = useCallback(async (request: UploadRequest) => {
        setTasks((prev) => [
            ...prev,
            {
                ...request,
                id: crypto.randomUUID(),
                status: "waiting",
                progress: 0,
                retries: 0,
            }
        ]);

        console.log(`upload: ${tasks.map((t) => `${t.name} + ${t.status}`).join("; ")}`)
        if (!queueProcessing.current) processNext();
    }, [processNext]);

    return (
        <UploadApiContext.Provider value={{ upload, cancelTask, tasks }}>
            {children}
        </UploadApiContext.Provider>
    );
}