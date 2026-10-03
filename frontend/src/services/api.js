const API_BASE = '/api';

export async function registerArtifact(formData) {
  const res = await fetch(`${API_BASE}/artifacts/register`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to register artifact');
  return data;
}

export async function logTransformation(formData) {
  const res = await fetch(`${API_BASE}/artifacts/transform`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to log transformation');
  return data;
}

export async function verifyArtifact(formDataOrHash) {
  let options = {};
  if (formDataOrHash instanceof FormData) {
    options = {
      method: 'POST',
      body: formDataOrHash
    };
  } else {
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash: formDataOrHash })
    };
  }
  const res = await fetch(`${API_BASE}/artifacts/verify`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to verify artifact');
  return data;
}

export async function verifyPromptCommitment(fileHash, revealedPrompt, salt) {
  const res = await fetch(`${API_BASE}/artifacts/verify-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileHash, revealedPrompt, salt })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to verify prompt');
  return data;
}

export async function runAdversarialSimulation(scenarioType, originalContent) {
  const res = await fetch(`${API_BASE}/adversarial/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenarioType, originalContent })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to run simulation');
  return data;
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/artifacts/stats`);
  return res.json();
}
