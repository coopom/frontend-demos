import { ForwardRefRenderFunction, forwardRef, memo, useCallback, useImperativeHandle, useRef } from "react";
import { Box, ActionBox } from "./index.sty";
import Editor, { OnMount, loader } from "@monaco-editor/react";

type CodePaneHandle = {
    setCode: (code: string) => void
}

type CodePaneProps = {
    onRun?: (code: string) => void,
    onReset?: () => void,
    code: string
}

const CodePane: ForwardRefRenderFunction<CodePaneHandle, CodePaneProps> = ({ onRun, onReset, code }, ref) => {

    const editorRef = useRef<any>(null);
    const onEditorDidMount: OnMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
    }, []);

    const handleReset = onReset && useCallback(onReset, [code]);
    const handleRun = useCallback(() => onRun?.(editorRef.current.getValue()), []);

    useImperativeHandle(ref, () => ({
        setCode: code => editorRef?.current?.setValue(code)
    }))

    return (
        <Box>
            <ActionBox>
                <button onClick={handleRun}>运行</button>
                <button onClick={handleReset}>重置</button>
            </ActionBox>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                theme="vs-dark"
                options={{
                    fontSize: 16
                }}
                onMount={onEditorDidMount}
            />
        </Box>
    )
}

export default memo(forwardRef(CodePane));