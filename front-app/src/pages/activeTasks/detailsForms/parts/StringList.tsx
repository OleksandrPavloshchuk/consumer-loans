export const stringList = (src: string[] | undefined)=> <ul>
    {src &&
        src.map( (s, i) => <li key={i}>{s}</li>)
    }
</ul>;