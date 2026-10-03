const API_BASE = '/api';

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch platform stats');
  return res.json();
}

export async function registerGenesis(formData) {
  const res = await fetch(`${API_BASE}/artifacts/genesis`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to register genesis asset');
  return data;
}

export async function logTransformation(formData) {
  const res = await fetch(`${API_BASE}/artifacts/transform`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to log transformation');
  return data;
}

export async function verifyArtifact(fileOrHash) {
  let formData;
  if (fileOrHash instanceof File || fileOrHash instanceof Blob) {
    formData = new FormData();
    formData.append('file', fileOrHash);
  } else if (fileOrHash instanceof FormData) {
    formData = fileOrHash;
  } else {
    formData = new FormData();
    formData.append('file_hash', fileOrHash);
  }

  const res = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Verification request failed');
  return data;
}

export async function verifyPromptCommitment(fileHash, revealedPrompt, salt) {
  const formData = new FormData();
  formData.append('file_hash', fileHash);
  formData.append('revealed_prompt', revealedPrompt);
  formData.append('salt', salt);

  const res = await fetch(`${API_BASE}/verify/prompt`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Prompt verification failed');
  return data;
}

export async function runElaForensics(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/verify/forensics/ela`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'ELA forensic analysis failed');
  return data;
}

export async function embedWatermark(file, secretText) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('secret_text', secretText);

  const res = await fetch(`${API_BASE}/watermark/embed`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Watermark embedding failed');
  return res.blob();
}

export async function extractWatermark(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/watermark/extract`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Watermark extraction failed');
  return data;
}

export async function getLineage(fileHash) {
  const res = await fetch(`${API_BASE}/artifacts/${fileHash}/lineage`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch lineage');
  return data;
}

export async function getPassport(fileHash) {
  const res = await fetch(`${API_BASE}/artifacts/${fileHash}/passport`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch passport');
  return data;
}

export async function simulateTamper(fileHash, tamperType = 'BYTE_MUTATION') {
  const res = await fetch(`${API_BASE}/adversarial/simulate-tamper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_hash: fileHash, tamper_type: tamperType })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Tamper simulation failed');
  return data;
}

export async function simulateDuplicate(originalHash) {
  const res = await fetch(`${API_BASE}/adversarial/duplicate-genesis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ original_hash: originalHash })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Duplicate simulation failed');
  return data;
}

export async function simulateBrokenChain(danglingParentHash) {
  const res = await fetch(`${API_BASE}/adversarial/broken-chain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dangling_parent_hash: danglingParentHash })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Broken chain simulation failed');
  return data;
}
