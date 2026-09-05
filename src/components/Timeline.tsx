import React from 'react';
import { ComplaintStatus } from '../types.ts';
import { Check, Clock, ShieldAlert, Sparkles } from 'lucide-react';

interface TimelineProps {
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}

export const Timeline: React.FC<TimelineProps> = ({ status, createdAt, updatedAt }) => {
  const steps: { key: string; label: string; description: string }[] = [
    {
      key: 'submitted',
      label: 'Complaint Submitted',
      description: 'Ticket registered into the system',
    },
    {
      key: 'Pending',
      label: 'Pending Review',
      description: 'Awaiting administrator triage & assignment',
    },
    {
      key: 'In Progress',
      label: 'In Progress',
      description: 'Technician/staff actively resolving issue',
    },
    {
      key: 'Resolved',
      label: 'Resolved',
      description: 'Action verified and complaint closed',
    },
  ];

  const getStepIndex = (st: ComplaintStatus): number => {
    switch (st) {
      case 'Pending':
        return 1;
      case 'In Progress':
        return 2;
      case 'Resolved':
        return 3;
      default:
        return 0;
    }
  };

  const activeIdx = getStepIndex(status);

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div id="complaint-status-timeline" className="py-2">
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIdx;
            const isCurrent = idx === activeIdx;

            return (
              <div
                key={step.key}
                id={`timeline-step-${idx}`}
                className="relative flex flex-col items-start sm:items-center text-left sm:text-center group"
              >
                {/* Connecting bar for desktop */}
                {idx < steps.length - 1 && (
                  <div
                    className={`hidden sm:block absolute top-4 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                      idx < activeIdx ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Step indicator circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    isCurrent
                      ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                      : isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 animate-pulse" />
                  ) : (
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  )}
                </div>

                {/* Step Label & Details */}
                <div className="mt-2.5">
                  <p
                    className={`text-xs sm:text-sm font-semibold ${
                      isCurrent
                        ? 'text-blue-900'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {step.description}
                  </p>
                  {idx === 0 && (
                    <span className="inline-block mt-1 text-[10px] font-mono text-slate-400">
                      {formatDate(createdAt)}
                    </span>
                  )}
                  {isCurrent && idx > 0 && (
                    <span className="inline-block mt-1 text-[10px] font-mono text-blue-600 font-medium">
                      Updated {formatDate(updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
