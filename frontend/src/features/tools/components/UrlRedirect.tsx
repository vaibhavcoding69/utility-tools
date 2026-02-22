import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UrlRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid URL");
      return;
    }

    const doRedirect = async () => {
      try {
        const res = await fetch(`/api/security/url/lookup/${slug}`);
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          setError("Short URL not found");
        }
      } catch {
        setError("Failed to look up URL");
      }
    };

    doRedirect();
  }, [slug]);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          maxWidth: '400px'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: '#ff6b6b' }} />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Short URL not found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            This short URL doesn't exist or may have been removed.
          </p>
          <a href="/" style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ffffff',
            color: '#000000',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <i className="bi bi-arrow-repeat" style={{ 
            fontSize: '2rem',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}