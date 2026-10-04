import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Upload, 
  FileText, 
  KeyRound, 
  Sparkles, 
  Zap, 
  Download, 
  Search, 
  CheckCircle2, 
  Layers, 
  Scan,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BorderGlow } from './cards';
import { verifyArtifact, verifyPromptCommitment, runElaForensics, getPassport } from '../services/api';

export default function VerifyView({ onSwitchTab }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [manualHash, setManualHash] = useState('');
  const [isTamperActive, setIsTamperActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // ELA Forensics state
  const [isElaRunning, setIsElaRunning] = useState(false);
  const [elaResult, setElaResult] = useState(null);

  // Prompt Reveal state
  const [revealedPrompt, setRevealedPrompt] = useState('');
  const [promptSalt, setPromptSalt] = useState('');
  const [promptMatchStatus, setPromptMatchStatus] = useState(null);
  const [isVerifyingPrompt, setIsVerifyingPrompt] = useState(false);

  // Preloaded demo sample cards
  const demoSamples = [
    {
      id: 'genesis-cyber',
      title: 'Genesis Cyber AI Portrait',
      desc: 'Tier 1 Verified • Original On-Chain Creation',
      tag: 'Tier 1 Authentic',
      color: '#10b981',
      glowColor: '160 85% 60%',
      colors: ['#10b981', '#06b6d4', '#7c3aed'],
      hash: '0x9fa17b4c6e82d1a3f5b7c9e0d2a4f6b8c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0',
      prompt: 'Photorealistic cyberpunk synthetic human with bioluminescent circuitry',
      salt: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      id: 'derived-child',
      title: 'Color-Graded Derivative',
      desc: 'Tier 2 Linked • Merkle DAG Child Lineage',
      tag: 'Tier 2 Derived',
      color: '#00f0ff',
      glowColor: '190 90% 55%',
      colors: ['#00f0ff', '#38bdf8', '#7c3aed'],
      hash: '0x4a8b2c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6e82d1a3f5b7c9e0d2a4f6',
      prompt: 'Cyberpunk synthetic portrait color-graded in neon teal and magenta',
      salt: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    },
    {
      id: 'deepfake-tamper',
      title: 'Adversarial Deepfake Inject',
      desc: 'Tier 3 Tampered • Silent Pixel Manipulation',
      tag: 'Tier 3 Disputed',
      color: '#ff3366',
      glowColor: '350 90% 60%',
      colors: ['#ff3366', '#ff00c8', '#7c3aed'],
      hash: '0x000000000000000000000000000000000000000000000000000000000000bad1',
      prompt: 'Adversarially injected deepfake payload',
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000'
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setManualHash('');
      setVerificationResult(null);
      setElaResult(null);
    }
  };

  const handleSelectDemo = (sample) => {
    setSelectedFile(null);
    setFilePreview(null);
    setManualHash(sample.hash);
    setRevealedPrompt(sample.prompt);
    setPromptSalt(sample.salt);
    setVerificationResult(null);
    setElaResult(null);
  };

  const handleVerify = async () => {
    if (!selectedFile && !manualHash) {
      alert('Please upload a file or select a preloaded demo sample!');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      let payload;
      if (selectedFile) {
        if (isTamperActive) {
          // Flip bits in the buffer to simulate silent tampering!
          const buffer = await selectedFile.arrayBuffer();
          const mutated = new Uint8Array(buffer);
          mutated[0] = mutated[0] ^ 0xff;
          mutated[Math.floor(mutated.length / 2)] = mutated[Math.floor(mutated.length / 2)] ^ 0xaa;
          const tamperedBlob = new Blob([mutated], { type: selectedFile.type });
          payload = tamperedBlob;
        } else {
          payload = selectedFile;
        }
      } else {
        payload = isTamperActive ? manualHash.slice(0, -4) + 'bad1' : manualHash;
      }

      const res = await verifyArtifact(payload);
      setVerificationResult(res);

      if (res.trustTier === 1 || res.status === 'EXACT_MATCH') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#38bdf8']
        });
      }
    } catch (err) {
      alert(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRunEla = async () => {
    if (!selectedFile) {
      alert('Please upload an image file to run Error Level Analysis.');
      return;
    }
    setIsElaRunning(true);
    try {
      const res = await runElaForensics(selectedFile);
      setElaResult(res);
    } catch (err) {
      alert(err.message || 'ELA analysis failed');
    } finally {
      setIsElaRunning(false);
    }
  };

  const handleVerifyPrompt = async () => {
    const targetHash = verificationResult?.fileHash || manualHash;
    if (!targetHash || !revealedPrompt || !promptSalt) {
      alert('Missing target hash, revealed prompt, or salt.');
      return;
    }
    setIsVerifyingPrompt(true);
    try {
      const res = await verifyPromptCommitment(targetHash, revealedPrompt, promptSalt);
      setPromptMatchStatus(res.isValid);
    } catch (err) {
      setPromptMatchStatus(false);
    } finally {
      setIsVerifyingPrompt(false);
    }
  };

  const handleDownloadPassport = async () => {
    const hash = verificationResult?.fileHash || manualHash;
    if (!hash) return;
    try {
      const passport = await getPassport(hash);
      const blob = new Blob([JSON.stringify(passport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Provenance_Passport_${hash.slice(0, 10)}.json`;
      a.click();
    } catch (e) {
      alert('Could not download passport: ' + e.message);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--neon-emerald)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <ShieldCheck size={16} />
          DUAL-HASH CRYPTOGRAPHIC AUDIT ENGINE
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          color: '#fff',
          marginBottom: '10px'
        }}>
          Verify Asset Integrity & Lineage
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '0.95rem' }}>
          Evaluate digital assets across on-chain EVM records. Performs simultaneous exact byte SHA-256 and fuzzy visual pHash matching to detect tampering, re-encoding, and deepfakes.
        </p>
      </div>

      {/* Preloaded Demo Samples */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '12px', letterSpacing: '0.05em' }}>
          QUICK DEMO SAMPLES (CLICK TO AUDIT WITH ZERO EFFORT)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {demoSamples.map((sample) => (
            <BorderGlow
              key={sample.id}
              onClick={() => handleSelectDemo(sample)}
              borderRadius={16}
              glowRadius={28}
              colors={sample.colors}
              glowColor={sample.glowColor}
              style={{
                cursor: 'pointer',
                background: manualHash === sample.hash ? 'rgba(16, 185, 129, 0.10)' : 'var(--bg-card)',
                boxShadow: manualHash === sample.hash ? `0 0 20px ${sample.color}44` : 'none',
              }}
            >
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>{sample.title}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '999px',
                    background: `${sample.color}22`,
                    color: sample.color,
                    border: `1px solid ${sample.color}44`,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em'
                  }}>
                    {sample.tag}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{sample.desc}</div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>

      {/* Interactive Ingestion Card */}
      <BorderGlow
        borderRadius={24}
        glowRadius={40}
        colors={['#10b981', '#06b6d4', '#7c3aed']}
        glowColor="160 85% 60%"
        style={{ marginBottom: '32px' }}
      >
        <div style={{ padding: '32px' }}>
          {/* Dropzone */}
          <label className="dropzone-cyber" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed rgba(255, 255, 255, 0.15)',
            background: 'rgba(3, 7, 18, 0.6)',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*,.pdf,.bin"
            />
            {filePreview ? (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={filePreview}
                  alt="Upload preview"
                  style={{ maxHeight: '180px', borderRadius: '12px', marginBottom: '12px', border: '1px solid var(--neon-emerald)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)' }}
                />
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{selectedFile?.name}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{(selectedFile?.size / 1024).toFixed(1)} KB</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Upload size={36} color="var(--neon-emerald)" style={{ marginBottom: '12px' }} />
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>
                  Drop image or file to audit provenance
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Supports PNG, JPEG, WEBP, PDF • Bitwise SHA-256 + Perceptual Analysis
                </div>
              </div>
            )}
          </label>

          {/* Or manual hash input */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '6px', letterSpacing: '0.04em' }}>
              OR SEARCH BY 32-BYTE CRYPTOGRAPHIC HASH
            </div>
            <input
              type="text"
              value={manualHash}
              onChange={(e) => {
                setManualHash(e.target.value);
                setSelectedFile(null);
                setFilePreview(null);
              }}
              placeholder="0x..."
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(3, 7, 18, 0.75)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--neon-emerald)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
              }}
            />
          </div>

          {/* 1-Click Tamper Simulation & Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            {/* Tamper Switch */}
            <div
              onClick={() => setIsTamperActive(!isTamperActive)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 18px',
                borderRadius: '999px',
                background: isTamperActive ? 'rgba(244, 63, 94, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: isTamperActive ? '1px solid var(--neon-crimson)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isTamperActive ? '0 0 15px rgba(244, 63, 94, 0.3)' : 'none'
              }}
            >
              <Zap size={18} color={isTamperActive ? 'var(--neon-crimson)' : 'var(--text-dim)'} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isTamperActive ? 'var(--neon-crimson)' : 'var(--text-muted)' }}>
                  ⚡ Inject Silent Tamper: {isTamperActive ? 'ON (Bit-Flipped)' : 'OFF (Clean)'}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  Flips buffer bits to demonstrate real-time Tier 3 detection
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {selectedFile && (
                <button
                  onClick={handleRunEla}
                  disabled={isElaRunning}
                  className="btn-cyber"
                  style={{
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    color: 'var(--neon-cyan)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Scan size={16} />
                  <span>{isElaRunning ? 'Analyzing...' : 'Run ELA Forensics'}</span>
                </button>
              )}

              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="btn-cyber"
                style={{
                  padding: '12px 32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  color: '#030712',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
                }}
              >
                {isVerifying ? <RefreshCw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                <span>{isVerifying ? 'Auditing On-Chain...' : 'Verify Cryptographic Integrity'}</span>
              </button>
            </div>
          </div>
        </div>
      </BorderGlow>

      {/* Verification Results Section */}
      {verificationResult && (
        <BorderGlow
          borderRadius={24}
          glowRadius={42}
          colors={
            verificationResult.trustTier === 1 ? ['#10b981', '#06b6d4', '#047857'] :
            verificationResult.trustTier === 2 ? ['#00f0ff', '#8b5cf6', '#3b82f6'] :
            ['#ff3366', '#ff00c8', '#e11d48']
          }
          glowColor={
            verificationResult.trustTier === 1 ? '160 85% 60%' :
            verificationResult.trustTier === 2 ? '190 90% 55%' :
            '350 90% 60%'
          }
          style={{ marginBottom: '32px' }}
        >
          <div style={{ padding: '32px' }}>
            {/* Header Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: verificationResult.trustTier === 1 ? 'rgba(16, 185, 129, 0.2)' :
                              verificationResult.trustTier === 2 ? 'rgba(6, 182, 212, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${
                    verificationResult.trustTier === 1 ? 'rgba(16, 185, 129, 0.4)' :
                    verificationResult.trustTier === 2 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(244, 63, 94, 0.4)'
                  }`
                }}>
                  {verificationResult.trustTier === 1 ? <CheckCircle2 size={26} color="var(--neon-emerald)" /> :
                   verificationResult.trustTier === 2 ? <Layers size={26} color="var(--neon-cyan)" /> :
                   <AlertTriangle size={26} color="var(--neon-crimson)" />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                    {verificationResult.tierLabel}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Verdict: <span style={{ fontWeight: 700, color: '#fff' }}>{verificationResult.verdict}</span> • Confidence: <span style={{ color: 'var(--neon-cyan)', fontWeight: 700 }}>{verificationResult.confidence}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadPassport}
                className="btn-cyber"
                style={{
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Provenance Passport (W3C VC)</span>
              </button>
            </div>

            {/* Forensic Details */}
            <div style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(3, 7, 18, 0.6)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.86rem',
              color: 'var(--text-muted)',
              marginBottom: '24px',
              lineHeight: 1.6
            }}>
              {verificationResult.details}
            </div>

            {/* Steganographic Watermark Banner (if found) */}
            {verificationResult.embeddedWatermark && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                color: 'var(--neon-purple)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '24px'
              }}>
                <Sparkles size={18} />
                <span>Invisible LSB Pixel Watermark Detected: {verificationResult.embeddedWatermark}</span>
              </div>
            )}

            {/* Hashes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(3, 7, 18, 0.5)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.04em' }}>
                  CURRENT SHA-256 DIGEST
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.80rem', color: 'var(--neon-emerald)', wordBreak: 'break-all' }}>
                  {verificationResult.fileHash}
                </div>
              </div>

              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(3, 7, 18, 0.5)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.04em' }}>
                  PERCEPTUAL HASH (pHASH/dHASH)
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.80rem', color: 'var(--neon-cyan)', wordBreak: 'break-all' }}>
                  {verificationResult.perceptualHash || 'N/A'}
                </div>
              </div>
            </div>

            {/* Merkle DAG Lineage Timeline */}
            {verificationResult.lineageChain?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '14px', letterSpacing: '0.04em' }}>
                  MERKLE DAG PROVENANCE ANCESTRY ({verificationResult.lineageChain.length} BLOCKS)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {verificationResult.lineageChain.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 18px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(3, 7, 18, 0.5)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#fff',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          BLOCK #{idx + 1}
                        </span>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{item.actionType}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>via {item.applicationName}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--neon-cyan)' }}>
                        {item.fileHash.slice(0, 14)}...{item.fileHash.slice(-8)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </BorderGlow>
      )}

      {/* ELA Forensics Result Heatmap */}
      {elaResult && (
        <BorderGlow
          borderRadius={24}
          glowRadius={36}
          colors={['#ff00c8', '#a855f7', '#00f0ff']}
          glowColor="300 90% 60%"
          style={{ marginBottom: '32px' }}
        >
          <div style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Scan size={20} color="var(--neon-cyan)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Error Level Analysis (ELA) Compression Heatmap
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
              {elaResult.elaHeatmapBase64 && (
                <img
                  src={elaResult.elaHeatmapBase64}
                  alt="ELA Heatmap"
                  style={{ width: '100%', maxHeight: '260px', objectFit: 'contain', borderRadius: '12px', background: '#000', border: '1px solid rgba(255,0,200,0.3)' }}
                />
              )}
              <div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>
                  Forensic Verdict: {elaResult.isTamperedLikely ? '⚠️ Anomalous Residual Clusters Detected' : '✅ Homogeneous Error Profile'}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
                  {elaResult.notes}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Max Compression Residual: <span style={{ color: 'var(--neon-cyan)', fontWeight: 700 }}>{elaResult.maxResidual}</span>
                </div>
              </div>
            </div>
          </div>
        </BorderGlow>
      )}

      {/* Zero-Knowledge Prompt Verification Section */}
      <BorderGlow
        borderRadius={24}
        glowRadius={36}
        colors={['#8b5cf6', '#3b82f6', '#06b6d4']}
        glowColor="250 85% 60%"
      >
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <KeyRound size={20} color="var(--neon-emerald)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
              Zero-Knowledge Prompt Commitment Verification
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Prove authorship of proprietary prompts without exposing them prior to dispute. Computes <code style={{ color: 'var(--neon-cyan)' }}>keccak256(revealedPrompt + salt)</code> against on-chain commitment.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Plaintext Prompt"
              value={revealedPrompt}
              onChange={(e) => setRevealedPrompt(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(3, 7, 18, 0.7)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
            <input
              type="text"
              placeholder="Creator Private Salt (0x...)"
              value={promptSalt}
              onChange={(e) => setPromptSalt(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(3, 7, 18, 0.7)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--neon-emerald)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <button
            onClick={handleVerifyPrompt}
            disabled={isVerifyingPrompt}
            className="btn-cyber"
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--neon-emerald)',
              color: 'var(--neon-emerald)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isVerifyingPrompt ? 'Auditing Salted Commitment...' : 'Verify Secret Prompt'}
          </button>

          {promptMatchStatus !== null && (
            <div style={{
              marginTop: '16px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              background: promptMatchStatus ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${promptMatchStatus ? 'var(--neon-emerald)' : 'var(--neon-crimson)'}`,
              color: promptMatchStatus ? 'var(--neon-emerald)' : 'var(--neon-crimson)',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              {promptMatchStatus ? '✅ PROMPT MATCH: Salted Keccak-256 commitment verified cryptographically on-chain!' :
                                  '❌ COMMITMENT MISMATCH: Revealed prompt or salt does not match on-chain commitment.'}
            </div>
          )}
        </div>
      </BorderGlow>
    </div>
  );
}
