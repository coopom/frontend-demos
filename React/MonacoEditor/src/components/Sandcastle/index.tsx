import { ElementRef, useEffect, useRef, useState } from "react";
import CodePane from "./CodePane";
import PreviewPane from "./PreviewPane";
import { Box } from "./index.sty"

const Sandcastle = () => {

    const [code, setCode] = useState<string>("");

    type CodePaneHandle = ElementRef<typeof CodePane>;
    const codePaneRef = useRef<CodePaneHandle>(null);

    type PreviewPaneHandle = ElementRef<typeof PreviewPane>;
    const previewPaneRef = useRef<PreviewPaneHandle>(null);

    const GetCode = () => {
        return new Promise<string>((resolve, reject) => {
            fetch("./test.js")
                .then(res => res.text())
                .then(res => resolve(res))
                .catch(err => reject(err));
        })
    }

    const handleReset = () => {
        GetCode()
            .then(res => {
                setCode(res);
                codePaneRef.current?.setCode(res);
                handleRun(res);
            })
    }

    const handleRun = (code: string) => {
        previewPaneRef.current?.writeIframe(code);
    }

    useEffect(() => {
        handleReset();
    }, [])

    return (
        <Box>
            <CodePane
                ref={codePaneRef}
                code={code}
                onReset={handleReset}
                onRun={handleRun}
            />
            <PreviewPane
                ref={previewPaneRef}
            />
        </Box>
    )
}

export default Sandcastle;