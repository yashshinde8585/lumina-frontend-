import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

/**
 * Hook to handle resume printing logic.
 * @param {string} docTitle - Title of the generated PDF.
 * @returns {Object} - { contentRef, handlePrint }
 */
export const usePrintResume = (docTitle: string = 'My_Resume') => {
    const contentRef = useRef<HTMLDivElement | null>(null);

    const reactToPrintFn = useReactToPrint({
        contentRef: contentRef,
        documentTitle: docTitle,
        onAfterPrint: () => toast.success("Download complete!"),
        onPrintError: () => toast.error("Failed to generate PDF"),
    });

    const handlePrint = () => {
        reactToPrintFn();
        toast.info("Preparing PDF Preview...");
    };

    return { contentRef, handlePrint };
};
