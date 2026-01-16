import { ResumeData } from '../../types';

interface ATSViewProps {
    data: ResumeData;
}

export const ATSView = ({ data }: ATSViewProps) => {
    // Helper to render section if data exists
    const hasData = (arr: any[]) => arr && arr.length > 0;

    return (
        <div className="bg-white p-12 max-w-[210mm] mx-auto shadow-sm border font-mono text-sm leading-relaxed text-black">
            {/* Header */}
            <h1 className="text-xl font-bold uppercase mb-4">{data.personalInfo.fullName}</h1>
            <div className="mb-4">
                {[
                    data.personalInfo.email,
                    data.personalInfo.phone,
                    data.personalInfo.linkedin
                ].filter(Boolean).join(' | ')}
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-4">
                    <h2 className="font-bold uppercase border-b border-black mb-2">Summary</h2>
                    <p>{data.summary}</p>
                </div>
            )}

            {/* Experience */}
            {hasData(data.experience) && (
                <div className="mb-4">
                    <h2 className="font-bold uppercase border-b border-black mb-2">Experience</h2>
                    {data.experience.map((exp: any, i: number) => (
                        <div key={i} className="mb-2">
                            <div className="font-bold">{exp.title}</div>
                            <div>{exp.company} | {exp.duration}</div>
                            <p className="mt-1">{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {hasData(data.projects) && (
                <div className="mb-4">
                    <h2 className="font-bold uppercase border-b border-black mb-2">Projects</h2>
                    {data.projects.map((proj: any, i: number) => (
                        <div key={i} className="mb-2">
                            <div className="font-bold">{proj.name}</div>
                            <div>{proj.tech}</div>
                            <p className="mt-1">{proj.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {hasData(data.education) && (
                <div className="mb-4">
                    <h2 className="font-bold uppercase border-b border-black mb-2">Education</h2>
                    {data.education.map((edu: any, i: number) => (
                        <div key={i} className="mb-2">
                            <div className="font-bold">{edu.school}</div>
                            <div>{edu.degree} | {edu.year}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {hasData(data.skills) && (
                <div>
                    <h2 className="font-bold uppercase border-b border-black mb-2">Skills</h2>
                    <p>{data.skills.join(', ')}</p>
                </div>
            )}
        </div>
    );
};
