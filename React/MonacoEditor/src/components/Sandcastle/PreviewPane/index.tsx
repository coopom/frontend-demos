import { ForwardRefRenderFunction, forwardRef, memo, useImperativeHandle, useRef } from "react";
import { Box } from "./index.sty";

type PreviewPaneHandle = {
    writeIframe: (code: string) => void
}

type PreviewPaneProps = {}

const PreviewPane: ForwardRefRenderFunction<PreviewPaneHandle, PreviewPaneProps> = ({ }, ref) => {

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const writeIframe = (code: string) => {
        if (iframeRef.current) {
            const iframeDoc = iframeRef.current.contentDocument;
            iframeDoc?.open();
            iframeDoc?.write(`
                <head>
                    <meta charset="UTF-8" />
                </head>
                <body onload="onload()">
                    <div id="map"></div>
                    <script>
                        function onload(){
                            ${code}
                        }
                    </script>
                </body>
            `);
            iframeDoc?.close();
        }
    }
    useImperativeHandle(ref, () => ({
        writeIframe
    }))

    return (
        <Box>
            <iframe ref={iframeRef}></iframe>
        </Box>
    )
}

export default memo(forwardRef(PreviewPane));