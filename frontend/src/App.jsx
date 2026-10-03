import { useState } from "react";
import "./App.css";

function App() {
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const decodeNotice = async () => {
    if (!notice.trim()) {
      setError("Please paste a college notice first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/decode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notice: notice,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to decode the notice.");
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      setError(
        "Could not connect to Deadline Decoder. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Deadline Decoder</div>

        <p className="tagline">
          Turn confusing college notices into clear actions.
        </p>
      </header>

      <main className="main">
        <section className="intro">
          <h1>
            Don't just read the notice.
            <br />
            <span>Decode it.</span>
          </h1>

          <p>
            Paste a college notice below and Deadline Decoder will identify
            what you actually need to do.
          </p>
        </section>

        <section className="input-section">
          <label htmlFor="notice">College notice</label>

          <textarea
            id="notice"
            value={notice}
            onChange={(event) => setNotice(event.target.value)}
            placeholder="Paste your college notice here..."
          />

          <button onClick={decodeNotice} disabled={loading}>
            {loading ? "Decoding..." : "Decode Notice"}
          </button>

          {error && <p className="error">{error}</p>}
        </section>

        {result && (
          <section className="result-section">
            <h2>Your decoded notice</h2>

            <div className="deadline-card">
              <p className="card-label">DEADLINE</p>

              <p className="deadline">
                {result.deadline || "Not specified"}
              </p>
            </div>

            <div className="result-grid">
              <div className="result-card">
                <h3>What you need to do</h3>

                <ul>
                  {result.tasks?.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </div>

              <div className="result-card">
                <h3>Submit through</h3>

                <p>
                  {result.submission_method || "Not specified"}
                </p>
              </div>

              <div className="result-card">
                <h3>Required materials</h3>

                <ul>
                  {result.required_materials?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="result-card warning-card">
                <h3>Important warnings</h3>

                {result.warnings?.length > 0 ? (
                  <ul>
                    {result.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No warnings specified.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;