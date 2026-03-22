'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  const handleReload = () => {
    window.location.reload();
  };

  // todo show error message
  // todo use components once I separate them from project

  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
          <h3 style = {{ margin: 10 }}>Oops!</h3>
          <h5 style = {{ margin: 10 }}>Something went wrong.</h5>
          <p style = {{ margin: 10 }}> An unexpected error has occurred. Please try reloading the page.</p>
          <button value = 'reload' onClick={handleReload}>Reload page</button>
        </div>
      </body>
    </html>
  );
}
