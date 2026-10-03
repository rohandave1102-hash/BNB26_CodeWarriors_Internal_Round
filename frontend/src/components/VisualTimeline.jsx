import React from 'react';
import { Layers, ArrowRight, ShieldCheck, Cpu, Clock, Link as LinkIcon, Check, Copy } from 'lucide-react';

export default function VisualTimeline({ lineage, onSelectNode }) {
  const [copiedHash, setCopiedHash] = React.useState(null);

  const copyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (!lineage || lineage.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--emerald)" />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
            Cryptographic Chain of Custody ({lineage.length} {lineage.length === 1 ? 'Block' : 'Blocks'})
          </h4>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          Traceability Back to Genesis Root
        </span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative'
      }}>
        {lineage.map((block, idx) => {
          const isGenesis = idx === 0;
          const isLatest = idx === lineage.length - 1;

          return (
            <div key={block.fileHash || idx} style={{ position: 'relative' }}>
              {/* Connector line */}
              {idx < lineage.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '26px',
                  top: '56px',
                  bottom: '-20px',
                  width: '2px',
                  background: 'linear-gradient(to bottom, var(--emerald), rgba(16, 185, 129, 0.2))',
                  zIndex: 0
                }} />
              )}

              <div
                style={{
                  display: 'flex',
                  gap: '18px',
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  background: isLatest ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.65)',
                  border: isLatest ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Node icon */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: isGenesis 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.2))' 
                    : 'rgba(30, 41, 59, 0.9)',
                  border: isGenesis ? '1px solid var(--emerald)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isGenesis ? (
                    <ShieldCheck size={26} color="var(--emerald)" />
                  ) : (
                    <Cpu size={22} color="var(--cyan)" />
                  )}
                </div>

                {/* Node Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: isGenesis ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                        color: isGenesis ? 'var(--emerald)' : 'var(--cyan)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {isGenesis ? 'ROOT GENESIS' : block.actionType || 'TRANSFORMATION'}
                      </span>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                        {block.applicationName || block.aiModel}
                      </h5>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      <Clock size={13} />
                      <span>{new Date(block.timestamp * 1000).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Hash row */}
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(7, 9, 14, 0.7)',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.75rem'
                    }}>
                      <span style={{ color: 'var(--text-dim)' }}>File Hash:</span>
                      <span className="mono-tag" style={{ color: 'var(--text-main)' }}>
                        {block.fileHash.slice(0, 10)}...{block.fileHash.slice(-8)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(block.fileHash)}
                        style={{ background: 'transparent', color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}
                        title="Copy full hash"
                      >
                        {copiedHash === block.fileHash ? <Check size={13} color="var(--emerald)" /> : <Copy size={13} />}
                      </button>
                    </div>

                    {block.parentHash && block.parentHash !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.72rem',
                        color: 'var(--text-dim)'
                      }}>
                        <LinkIcon size={12} color="var(--emerald)" />
                        <span>Parent:</span>
                        <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>
                          {block.parentHash.slice(0, 8)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
