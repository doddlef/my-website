importScripts('https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js');

self.onmessage = function (event) {
    const file = event.data;
    const chunkSize = 2 * 1024 * 1024; // Process in 2MB chunks
    let offset = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();

    reader.onload = function (e) {
        const result = e.target.result;
        if (result instanceof ArrayBuffer) {
            spark.append(result);
        }
        offset += chunkSize;
        if (offset < file.size) {
            loadNext();
        } else {
            self.postMessage(spark.end());
        }
    };

    reader.onerror = function () {
        self.postMessage({ error: 'File read error' });
    };

    function loadNext() {
        const slice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(slice);
    }

    loadNext();
};