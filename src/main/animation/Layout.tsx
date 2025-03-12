import { useState } from "react";

export default function Layout() {
    const [text, setText] = useState<string>("");

    return (
        <main className="w-screen h-screen bg-gray-200 flex flex-col justify-center items-center">
            <div className="w-96 bg-green-400 p-4">
                {/* Floated image */}
                <img src="/avatar.png" alt="Avatar" className="w-32 h-32 float-left mr-4"/>

                {/* Wrapped text */}
                <p className="text-2xl leading-relaxed">
                    {text}
                </p>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
                <button onClick={() => setText((prev) => prev + " 123")} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Click Me
                </button>
                <button onClick={() => setText("")} className="px-4 py-2 bg-red-500 text-white rounded">
                    Clear
                </button>
            </div>
        </main>
    );
}