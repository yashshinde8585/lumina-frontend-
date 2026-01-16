import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import {
    Clock, Briefcase, LayoutList, Calculator, Code,
    AlertCircle, CheckCircle, XCircle, Building, Plus, X, FileText
} from 'lucide-react';
import { SortableJobCard } from './SortableJobCard';
import { BoardColumn, JobCard } from '../../../types';

interface KanbanColumnProps {
    col: BoardColumn;
    highlightColumnId: string | null;
    onJobClick: (job: JobCard) => void;
    handleAddCard: (id: string) => void;
    submitQuickAdd: (id: string) => void;
    quickAddCol: string | null;
    setQuickAddCol: (id: string | null) => void;
    newJobCompany: string;
    setNewJobCompany: (val: string) => void;
    onMoveToNext?: (item: JobCard, currentColumnId: string) => void;
    onDeleteJob?: (id: string) => void;
    onStatusChange?: (item: JobCard, oldCol: string, newCol: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    col, highlightColumnId, onJobClick,
    handleAddCard, submitQuickAdd, quickAddCol, setQuickAddCol,
    newJobCompany, setNewJobCompany, onMoveToNext, onDeleteJob, onStatusChange
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
                    <button onClick={() => handleAddCard(col.id)} className="p-1 hover:bg-mist rounded text-steel hover:text-charcoal"><Plus size={14} /></button>
                </div>
            </div>

            {/* Droppable Area (Visual) */}
            <div className={`flex-1 flex flex-col gap-4 min-h-[150px] max-h-[600px] overflow-y-auto p-2 rounded-lg transition-colors ${isOver ? 'bg-blue-100/50 border-2 border-dashed border-blue-400' : 'bg-mist/30'}`}>
                <SortableContext
                    id={col.id}
                    items={col.items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {/* Quick Add */}
                    {quickAddCol === col.id && (
                        <div className="bg-white p-3 rounded-lg border-2 border-blue-100 shadow-sm">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Company..."
                                className="w-full text-sm border border-silver rounded px-2 py-1 mb-2"
                                value={newJobCompany}
                                onChange={(e) => setNewJobCompany(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && submitQuickAdd(col.id)}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setQuickAddCol(null)} className="p-1 text-steel"><X size={14} /></button>
                                <button onClick={() => submitQuickAdd(col.id)} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Add</button>
                            </div>
                        </div>
                    )}

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

                    {col.items.length === 0 && !quickAddCol && !isOver && (
                        <div className="h-32 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                            {col.id === 'saved' ? (
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={() => navigate('/generate')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                                    >
                                        <Plus size={14} />
                                        <span>New Resume</span>
                                    </button>
                                    <p className="text-xs text-gray-400 mt-1">Or drop a job here</p>
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
