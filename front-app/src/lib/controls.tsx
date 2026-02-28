import type {ReactNode} from "react";

export const createDetailsCard = (label: string, value: string|number|ReactNode|undefined) => (
    <div className={"card-details-item"}>
        <div className={"label"}>{label}</div>
        <div>{value}</div>
    </div>
);

export const stringList = (src: string[] | undefined)=> <ul>
    {src &&
        src.map( (s, i) => <li key={i}>{s}</li>)
    }
</ul>;