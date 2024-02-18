import { QInput } from "./components/qhtml/qhtml";

export default () => {
    return (
        <>
            <head>
                <meta charSet="utf-8" />
                <title>Qwik Blank App</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                <QInput label="Hello World!" />
            </body>
        </>
    );
};
