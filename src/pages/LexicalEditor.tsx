import React from 'react';
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';

const theme = {
    paragraph: 'mb-2',
    heading: {
        h1: 'text-2xl font-bold mb-2',
        h2: 'text-xl font-bold mb-2',
    },
    list: {
        ul: 'list-disc ml-4 mb-2',
        ol: 'list-decimal ml-4 mb-2',
    },
};

function Placeholder() {
    return <div className="absolute top-[20px] left-[20px] text-gray-400 pointer-events-none">Start writing your resume...</div>;
}

interface LexicalEditorProps {
    embedded?: boolean;
    isCompact?: boolean;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({ embedded, isCompact }) => {
    const initialConfig: InitialConfigType = {
        namespace: 'ResumeEditor',
        theme,
        onError: (e: Error) => console.error(e)
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={`relative bg-white rounded-lg ${embedded ? 'h-full' : 'min-h-screen p-8'}`}>
                <div className={`editor-inner relative min-h-[500px] ${isCompact ? 'text-sm' : ''}`}>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="outline-none min-h-[500px] resize-none focus:ring-0" />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={({ children }) => <>{children}</>}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
};

export default LexicalEditor;
