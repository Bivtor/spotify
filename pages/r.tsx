import { useEffect, useState } from "react";

const r = () => {

    const [state, setState] = useState(false);

    return (
        <div>
            {state}
        </div>
    )
}
export default r;