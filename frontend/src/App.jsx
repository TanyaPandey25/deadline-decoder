import { useState } from "react";
import "./App.css";

function App() {
  const [notice, setNotice] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
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

  const decodePdf = async () => {
    if (!pdfFile) {
      setError("Please choose a PDF first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const response = await fetch("http://127.0.0.1:8000/decode-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.detail || "Failed to decode the PDF."
        );
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
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
            Paste a college notice or upload a PDF and Deadline Decoder will
            identify what you actually need to do.
          </p>
        </section>

        <section className="input-section">
          <label htmlFor="notice">College notice</label>

          <textarea
            id="notice"
            value={notice}
            onChange={(event) => setNotice(event.target.value)}
            placeholder="Paste a college notice here..."
          />

          <button onClick={decodeNotice} disabled={loading}>
            {loading ? "Decoding..." : "Decode Notice"}
          </button>

          <div className="pdf-divider">
            <span>OR</span>
          </div>

          <label htmlFor="pdf">Upload a PDF</label>

          <input
            id="pdf"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(event) => {
              const file = event.target.files[0];

              setPdfFile(file || null);
              setError("");
              setResult(null);
            }}
          />

          {pdfFile && (
            <p className="file-name">
              Selected: {pdfFile.name}
            </p>
          )}

          <button
            onClick={decodePdf}
            disabled={loading || !pdfFile}
          >
            {loading ? "Decoding..." : "Decode PDF"}
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