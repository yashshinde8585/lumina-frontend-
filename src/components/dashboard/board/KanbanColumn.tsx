import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import {
    Clock, Briefcase, LayoutList, Calculator, Code,
    AlertCircle, CheckCircle, XCircle, Building, Plus, FileText
} from 'lucide-react';
import { SortableJobCard } from './SortableJobCard';
import { BoardColumn, JobCard } from '../../../types';

interface KanbanColumnProps {
    col: BoardColumn;
    highlightColumnId: string | null;
    onJobClick: (job: JobCard) => void;
    onMoveToNext?: (item: JobCard, currentColumnId: string) => void;
    onDeleteJob?: (id: string) => void;
    onStatusChange?: (item: JobCard, oldCol: string, newCol: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    col, highlightColumnId, onJobClick,
    onMoveToNext, onDeleteJob, onStatusChange
}) => {
    const navigate = useNavigate();

    const { setNodeRef, isOver } = useDroppable({
        id: col.id,
        data: {
            type: 'COLUMN',
            columnId: col.id
        }
    });

    const isHighlighted = highlightColumnId === col.id || isOver;

    const getColumnIcon = (id: string, color: string) => {
        const colorClass = `text-${color}-600`;
        switch (id) {
            case 'saved': return <Clock size={16} className={colorClass} />;
            case 'applied': return <Briefcase size={16} className={colorClass} />;
            case 'screening': return <LayoutList size={16} className={colorClass} />;
            case 'aptitude': return <Calculator size={16} className={colorClass} />;
            case 'technical': return <Code size={16} className={colorClass} />;
            case 'interview': return <AlertCircle size={16} className={colorClass} />;
            case 'offer': return <CheckCircle size={16} className={colorClass} />;
            case 'rejected': return <XCircle size={16} className={colorClass} />;
            default: return <Building size={16} className={colorClass} />;
        }
    };

    return (
        <motion.div
            id={`column-${col.id}`}
            className={`w-72 flex-shrink-0 flex flex-col rounded-xl transition-all duration-300 ${isHighlighted ? 'ring-4 ring-blue-200 bg-blue-50/30' : 'glass-panel'}`}
            animate={isHighlighted ? { scale: [1, 1.02, 1] } : {}}
            ref={setNodeRef}
        >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-t-lg bg-mist border-b-2 border-${col.color}-500 mb-2 group hover:bg-white transition-colors`}>
                <div className="flex items-center gap-2">
                    {getColumnIcon(col.id, col.color)}
                    <span className="font-semibold text-charcoal text-sm">{col.title}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.id === 'saved' ? 'bg-gray-100 text-gray-600' : `bg-${col.color}-100 text-${col.color}-700`}`}>
                        {col.items.length}
                    </span>
                </div>
                <div className="flex items-center gap-1 opacity-100 transition-opacity">
                    {col.id === 'saved' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate('/generate'); }}
                            className="p-1 hover:bg-blue-100 rounded text-blue-600 mr-1"
                            title="Create New Resume"
                        >
                            <FileText size={15} />
                        </button>
                    )}
                </div>
            </div>

            {/* Droppable Area (Visual) */}
            <div className={`flex-1 flex flex-col gap-4 min-h-[150px] max-h-[600px] overflow-y-auto p-2 rounded-lg transition-colors ${isOver ? 'bg-blue-100/50 border-2 border-dashed border-blue-400' : 'bg-mist/30'}`}>
                <SortableContext
                    id={col.id}
                    items={col.items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >


                    {col.items.map(item => (
                        <SortableJobCard
                            key={item.id}
                            item={item}
                            columnId={col.id}
                            onJobClick={onJobClick}
                            onMoveToNext={onMoveToNext}
                            onDelete={onDeleteJob}
                            onStatusChange={onStatusChange}
                        />
                    ))}

                    {col.items.length === 0 && !isOver && (
                        <div className="h-32 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                            {col.id === 'saved' ? (
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-sm font-medium text-gray-500">Drop a job here</p>
                                    <p className="text-xs text-gray-400">Drag any job card into this column.</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-500">Drop job here to update its stage</p>
                                    <p className="text-xs text-gray-400 mt-1">Drag any job card into this column.</p>
                                </>
                            )}
                        </div>
                    )}
                </SortableContext>
            </div>
        </motion.div>
    );
};
