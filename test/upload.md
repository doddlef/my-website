```typescript jsx
import { useState, useEffect } from "react";
import SparkMD5 from "spark-md5";

const CHUNK_SIZE = 1024 * 1024; // 1MB per chunk
const API_BASE = "/api/driver";

function useUploadQueue() {
  const [queue, setQueue] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (uploading) processQueue();
  }, [uploading]);

  const addToQueue = (file) => {
    setQueue((prev) => [...prev, { file, progress: 0, taskId: null, chunksUploaded: [] }]);
  };

  async function processQueue() {
    if (queue.length === 0) {
      setUploading(false);
      return;
    }
    
    const task = queue[0];
    const md5 = await calculateMD5(task.file);
    const fileSize = task.file.size;
    
    if (fileSize < CHUNK_SIZE) {
      await directUpload(task.file);
      finishTask();
      return;
    }
    
    const initRes = await fetch(`${API_BASE}/init/task`, {
      method: "POST",
      body: JSON.stringify({ name: task.file.name, md5, size: fileSize })
    }).then((res) => res.json());
    
    if (initRes.flag && !initRes.taskId) {
      finishTask();
      return;
    }
    
    task.taskId = initRes.taskId;
    const missingChunks = await fetch(`${API_BASE}/task/progress?taskId=${task.taskId}`).then(res => res.json());
    
    await uploadChunks(task, missingChunks);
    
    const finishRes = await fetch(`${API_BASE}/finish`, {
      method: "POST",
      body: JSON.stringify({ taskId: task.taskId })
    }).then((res) => res.json());
    
    if (finishRes.ok === 1) {
      finishTask();
    } else {
      await uploadChunks(task, finishRes.missingChunks);
      await fetch(`${API_BASE}/finish`, {
        method: "POST",
        body: JSON.stringify({ taskId: task.taskId })
      });
      finishTask();
    }
  }

  async function calculateMD5(file) {
    return new Promise((resolve) => {
      const spark = new SparkMD5.ArrayBuffer();
      const reader = new FileReader();
      reader.onload = (e) => {
        spark.append(e.target.result);
        resolve(spark.end());
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async function directUpload(file) {
    return fetch(`${API_BASE}/direct-upload`, {
      method: "POST",
      body: file,
    });
  }

  async function uploadChunks(task, missingChunks) {
    const file = task.file;
    const promises = missingChunks.map(async (index) => {
      const start = index * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      await fetch(`${API_BASE}/task`, {
        method: "POST",
        body: JSON.stringify({ taskId: task.taskId, index, chunk })
      });
    });
    
    await Promise.all(promises);
  }

  function finishTask() {
    setQueue((prev) => prev.slice(1));
  }

  return { addToQueue, uploading, setUploading };
}

export default useUploadQueue;

```