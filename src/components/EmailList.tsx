import React from 'react';
import { Mail, ShieldCheck, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';
import { EmailItem, EmailAuditRecord } from '../types/game';
import { soundManager } from '../utils/audio';

interface EmailListProps {
  emails: EmailItem[];
  selectedIndex: number;
  onSelectEmail: (index: number) => void;
  auditRecords: Record<string, EmailAuditRecord>;
}

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedIndex,
  onSelectEmail,
  auditRecords
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Inbox Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
            受信トレイ（審査対象キュー）
          </h2>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono font-medium">
          {emails.length} 件
        </span>
      </div>

      {/* Email Item Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {emails.map((email, index) => {
          const audit = auditRecords[email.id];
          const isSelected = index === selectedIndex;
          const isReviewed = !!audit;

          return (
            <button
              key={email.id}
              onClick={() => {
                soundManager.playClick();
                onSelectEmail(index);
              }}
              className={`w-full text-left p-3 transition-all relative flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-slate-800/90 border-l-4 border-l-cyan-500 shadow-sm'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              {/* Top row: ID, Sender, Status Badge */}
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono font-bold text-slate-500 text-[10px]">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-medium text-slate-200 truncate">
                    {email.senderDisplayName}
                  </span>
                </div>

                {/* Status badge */}
                <div>
                  {isReviewed ? (
                    audit.playerVerdict === 'SAFE' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        承認
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/50 font-medium">
                        <ShieldAlert className="w-3 h-3" />
                        隔離
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      未審査
                    </span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="text-xs font-medium text-slate-100 line-clamp-1 pr-1">
                {email.subject}
              </div>

              {/* Bottom row: Time & preview tag */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {email.receivedAt.split(' ')[1]}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  @{email.senderDomain}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
