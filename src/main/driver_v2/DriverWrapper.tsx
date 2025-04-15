import {lazy} from "react";

const Driver = lazy(() => import("./Layout.tsx"));

export default function DriverWrapper() {
    return <Driver />;
}
