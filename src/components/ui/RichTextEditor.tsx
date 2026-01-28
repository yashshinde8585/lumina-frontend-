import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = "Start typing...",
    className = "",
    minHeight = "400px"
}) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'blockquote', 'code-block'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'blockquote', 'code-block'
    ];

    const quillRef = useRef<ReactQuill>(null);
    const charCount = value.replace(/<[^>]*>/g, '').length;

    useEffect(() => {
        if (charCount > 2000 && quillRef.current) {
            const editor = quillRef.current.getEditor();
            const scrollContainer = editor.root; // This is the .ql-editor div
            if (scrollContainer) {
                // Use setTimeout to ensure the DOM has updated
                setTimeout(() => {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }, 0);
            }
        }
    }, [value, charCount]);

    return (
        <div className={`rich-text-editor border border-gray-200 bg-white overflow-hidden shadow-sm transition-all ${className}`}>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="bg-white"
                style={{
                    minHeight,
                    maxHeight: charCount > 2000 ? '700px' : 'none',
                    overflowY: charCount > 2000 ? 'auto' : 'visible',
                    overflowX: 'hidden'
                }}
            />

            {/* Custom Styles to make Quill look premium and match the dashboard */}
            <style>{`
                .rich-text-editor .ql-toolbar.ql-snow {
                    border: none;
                    border-bottom: 1px solid #f3f4f6;
                    background: #f9fafb;
                    padding: 8px 12px;
                }
                .rich-text-editor .ql-toolbar .ql-formats {
                    margin-right: 12px;
                }
                .rich-text-editor .ql-toolbar .ql-formats:last-child {
                    margin-right: 0;
                }
                .rich-text-editor .ql-container.ql-snow {
                    border: none;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.875rem;
                }
                .rich-text-editor .ql-editor {
                    min-height: ${minHeight};
                    padding: 32px !important;
                    line-height: 1.6;
                    color: #374151;
                    overflow-x: hidden !important;
                }
                @media (max-width: 640px) {
                    .rich-text-editor .ql-editor {
                        padding: 16px !important;
                    }
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: #d1d5db;
                    font-style: normal;
                    left: 32px;
                    top: 32px;
                }
                .rich-text-editor .ql-snow .ql-stroke {
                    stroke: #9ca3af;
                }
                .rich-text-editor .ql-snow .ql-fill {
                    fill: #9ca3af;
                }
                .rich-text-editor .ql-snow .ql-picker {
                    color: #6b7280;
                }
                .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
                .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke {
                    stroke: #3b82f6;
                }
                .rich-text-editor .ql-snow.ql-toolbar button:hover .ql-fill,
                .rich-text-editor .ql-snow.ql-toolbar button.ql-active .ql-fill {
                    fill: #3b82f6;
                }
                .rich-text-editor .ql-snow.ql-toolbar button:hover,
                .rich-text-editor .ql-snow.ql-toolbar button.ql-active {
                    color: #3b82f6;
                }
            `}</style>

            {/* Footer Stats */}
            <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>{value.replace(/<[^>]*>/g, '').length} characters</span>
                    <span>{value.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words</span>
                </div>
            </div>
        </div>
    );
};

export default RichTextEditor;
