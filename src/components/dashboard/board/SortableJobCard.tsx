import React from 'react';
import { DollarSign, AlertCircle, Clock, FileText, ArrowRight, Info, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JobCard } from '../../../types';

interface SortableJobCardProps {
    item: JobCard;
    columnId: string;
    onJobClick: (item: JobCard) => void;
    onMoveToNext?: (item: JobCard, currentColumnId: string) => void;
    onDelete?: (id: string) => void;
    onStatusChange?: (item: JobCard, oldCol: string, newCol: string) => void;
}

export const SortableJobCard: React.FC<SortableJobCardProps> = ({
    item,
    columnId,
    onJobClick,
    onMoveToNext,
    onDelete,
    onStatusChange
}) => {
    // Determine status badge color/style
    const getStatusStyle = () => {
        if (item.linkedResumeId) return 'bg-white shadow-[0_2px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]';
        if (item.externalResume) return 'bg-white shadow-[0_2px_8px_rgba(168,85,247,0.1)] hover:shadow-[0_4px_12px_rgba(168,85,247,0.15)]';
        return 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]';
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: item.id,
        data: {
            type: 'JOB',
            item,
            columnId // Pass columnId to know where it came from
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-40 bg-gray-100 p-4 rounded-xl border border-dashed border-gray-400 h-[120px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onJobClick(item)}
            className={`
                group relative p-4 rounded-2xl transition-all duration-300 cursor-grab active:cursor-grabbing
                ${getStatusStyle()} hover:-translate-y-1
                ${columnId === 'overlay' ? 'shadow-2xl rotate-3 cursor-grabbing bg-white ring-1 ring-blue-400' : ''}
            `}
        >
            <div className="flex items-start gap-3 mb-3">
                {/* Auto-Fetched Logo */}
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                        src={`https://logo.clearbit.com/${item.company.toLowerCase().replace(/\s/g, '')}.com`}
                        alt={item.company}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex';
                        }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 font-bold items-center justify-center text-sm">
                        {item.company.substring(0, 2).toUpperCase()}
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 text-sm truncate leading-tight mb-0.5" title={item.company}>{item.company}</h4>
                    <p className="text-xs text-blue-600 truncate font-medium">{item.role}</p>
                </div>
            </div>

            {/* Badges - Pill Style */}
            <div className="flex flex-wrap gap-2 mb-3">
                {item.linkedResumeId ? (
                    <span className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold px-2 py-0.5 rounded-full bg-blue-50/80">
                        <FileText size={9} strokeWidth={2.5} /> Resume Added
                    </span>
                ) : item.externalResume ? (
                    <span className="flex items-center gap-1 text-[10px] text-purple-600 font-semibold px-2 py-0.5 rounded-full bg-purple-50/80">
                        <FileText size={9} strokeWidth={2.5} /> PDF
                    </span>
                ) : null}

                {item.salary && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-semibold px-2 py-0.5 rounded-full bg-green-50/80">
                        <DollarSign size={9} strokeWidth={2.5} /> {item.salary}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-50">
                <span className="flex items-center gap-1">
                    <Clock size={10} /> {new Date(item.date).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                    {onMoveToNext && columnId !== 'rejected' && columnId !== 'offer' && columnId !== 'ghosted' ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveToNext(item, columnId);
                            }}
                            className="p-1.5 rounded-full bg-gray-50 hover:bg-black text-gray-500 hover:text-white transition-all group/btn"
                            title="Move to Next Stage"
                        >
                            <ArrowRight size={12} strokeWidth={2} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Desktop Action Buttons - Top Right */}
            {/* Desktop Action Buttons - Top Right (Subtle) */}
            <div className="hidden md:flex absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Delete Button */}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Remove application for ${item.company}?`)) {
                                onDelete(item.id);
                            }
                        }}
                        className="p-1.5 rounded-lg bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 backdrop-blur-sm transition-colors"
                        title="Delete Application"
                    >
                        <Trash2 size={13} strokeWidth={2} />
                    </button>
                )}
            </div>
        </div >
    );
};
