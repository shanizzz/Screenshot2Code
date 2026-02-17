import { useState } from 'react';

const API_URL = '/api';

export default function App() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [html, setHtml] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setHtml(null);
    setImage(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleConvert = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const res = await fetch(`${API_URL}/convert`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Conversion failed');
      }

      setHtml(data.html);
      setActiveTab('preview');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setHtml(null);
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Screenshot → Code</h1>
        <p style={styles.subtitle}>
          Upload a UI screenshot and get HTML + Tailwind CSS
        </p>
      </header>

      <main style={styles.main}>
        {/* Upload Zone */}
        <section style={styles.uploadSection}>
          <label style={styles.uploadLabel}>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            <div style={styles.uploadBox}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={styles.previewImage}
                />
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <span style={styles.uploadIcon}>📷</span>
                  <p>Drop a screenshot or click to upload</p>
                  <p style={styles.uploadHint}>PNG, JPEG, WebP • Max 5MB</p>
                </div>
              )}
            </div>
          </label>

          <div style={styles.actions}>
            <button
              onClick={handleConvert}
              disabled={!image || loading}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: !image || loading ? 0.5 : 1,
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  Converting...
                </>
              ) : (
                'Generate Code'
              )}
            </button>
            {image && !loading && (
              <button onClick={handleReset} style={styles.button}>
                Start Over
              </button>
            )}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Result */}
        {html && (
          <section style={styles.resultSection}>
            <div style={styles.tabs}>
              <button
                onClick={() => setActiveTab('preview')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'preview' ? styles.tabActive : {}),
                }}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'code' ? styles.tabActive : {}),
                }}
              >
                Code
              </button>
            </div>

            {activeTab === 'preview' ? (
              <div style={styles.previewWrapper}>
                <iframe
                  srcDoc={html}
                  title="Generated preview"
                  style={styles.iframe}
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              <pre style={styles.codeBlock}>
                <code>{html}</code>
              </pre>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  uploadSection: {
    background: 'var(--bg-card)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    padding: '2rem',
    marginBottom: '1.5rem',
  },
  uploadLabel: {
    cursor: 'pointer',
    display: 'block',
  },
  fileInput: {
    display: 'none',
  },
  uploadBox: {
    border: '2px dashed var(--border)',
    borderRadius: '10px',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  uploadPlaceholder: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '2rem',
  },
  uploadIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem',
  },
  uploadHint: {
    fontSize: '0.875rem',
    marginTop: '0.5rem',
    opacity: 0.8,
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-input)',
    color: 'var(--text)',
    fontFamily: 'inherit',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  primaryButton: {
    background: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'white',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--error)',
    color: 'var(--error)',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  resultSection: {
    background: 'var(--bg-card)',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    overflow: 'hidden',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--border)',
    padding: '0 1rem',
  },
  tab: {
    padding: '1rem 1.5rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'inherit',
    fontSize: '1rem',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
  },
  tabActive: {
    color: 'var(--accent)',
    borderBottomColor: 'var(--accent)',
  },
  previewWrapper: {
    padding: '1.5rem',
    background: 'white',
    minHeight: '400px',
  },
  iframe: {
    width: '100%',
    minHeight: '500px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
  },
  codeBlock: {
    padding: '1.5rem',
    overflow: 'auto',
    maxHeight: '500px',
    margin: 0,
    background: 'var(--bg-input)',
    fontSize: '0.85rem',
    lineHeight: 1.6,
  },
};
