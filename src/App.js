import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const DATA_URL = "https://raw.githubusercontent.com/onurbayl/data/refs/heads/main/data.json";

// 🔊 Telaffuz fonksiyonu
const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US"; // İngilizce telaffuz
  speechSynthesis.speak(utterance);
};

// Ana flashcard ekranı
function Flashcards({ flashcards }) {
  const [index, setIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [finished, setFinished] = useState(false);

  const nextCard = () => {
    if (index + 1 < flashcards.length) {
      setIndex(index + 1);
      setShowDetails(false);
    } else {
      setFinished(true);
      setShowDetails(false);
    }
  };

  const prevCard = () => {
    if (index > 0) {
      setIndex(index - 1);
      setShowDetails(false);
      setFinished(false);
    }
  };

  if (flashcards.length === 0)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  const card = flashcards[index];

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <Link to="/search" style={{ display: "block", marginBottom: "1rem", color: "#007bff", textAlign: "center" }}>
        🔍 Kelime Ara
      </Link>

      <div
        onClick={() => setShowDetails(!showDetails)}
        style={{ border: "1px solid #ccc", borderRadius: 12, padding: 20, cursor: "pointer", background: "#fff" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{card.word}</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              speak(card.word);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              marginBottom: "1rem"
            }}
            title="Telaffuz et"
          >
            🔊
          </button>
        </div>

        {showDetails && (
          <>
            <p style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "6px" }}>Definition:</p>
            <p style={{ marginLeft: "12px", marginBottom: "12px", lineHeight: "1.4" }}>{card.definition}</p>

            <p style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "6px" }}>Examples:</p>
            <div style={{ marginLeft: "20px", marginBottom: "12px", lineHeight: "1.4" }}>
              {card.examples.map((ex, i) => (
                <p key={i} style={{ marginBottom: "6px" }}>• {ex}</p>
              ))}
            </div>

            <p style={{
              fontStyle: "italic", backgroundColor: "#f0f8ff", padding: "8px 12px",
              borderRadius: "8px", color: "#333", marginTop: "10px", lineHeight: "1.4",
            }}>
              Notes: {card.notes}
            </p>
          </>
        )}
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button onClick={prevCard} disabled={index === 0} style={{
          marginRight: 10, backgroundColor: "#FFD700", border: "none",
          padding: "8px 16px", borderRadius: "6px", cursor: index === 0 ? "not-allowed" : "pointer",
          color: "#000", fontWeight: "600"
        }}>
          Önceki
        </button>

        <button onClick={nextCard} disabled={finished} style={{
          backgroundColor: "#4CAF50", border: "none",
          padding: "8px 16px", borderRadius: "6px", cursor: finished ? "not-allowed" : "pointer",
          color: "#fff", fontWeight: "600"
        }}>
          Sonraki
        </button>
      </div>

      {finished && (
        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "green", fontWeight: "700", fontSize: "1.2rem" }}>
          Tebrikler, tüm kartlar bitti!
        </p>
      )}
    </div>
  );
}

// Arama sayfası
function SearchPage({ flashcards }) {
  const [search, setSearch] = useState("");

  const filtered = flashcards.filter(card => {
    const text = `${card.word} ${card.definition} ${card.notes} ${card.examples.join(" ")}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <Link to="/" style={{ display: "block", marginBottom: "1rem", color: "#007bff" }}>← Ana Sayfa</Link>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Ara..."
        style={{
          width: "100%", padding: "10px", fontSize: "1rem", borderRadius: "8px",
          border: "1px solid #ccc", marginBottom: "0.5rem"
        }}
      />

      {search.trim() !== "" && filtered.length !== 0 && (
        <p style={{ marginBottom: "1rem", color: "#555" }}>
          {filtered.length} sonuç bulundu.
        </p>
      )}

      {filtered.length === 0 ? (
        <p>Sonuç bulunamadı.</p>
      ) : (
        filtered.map((card, i) => (
          <div key={i} style={{
            border: "1px solid #ddd", borderRadius: "8px", padding: "12px", marginBottom: "1rem", background: "#fafafa"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>{card.word}</h3>
              <button
                onClick={() => speak(card.word)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem" }}
                title="Telaffuz et"
              >
                🔊
              </button>
            </div>
            <p><strong>Definition:</strong> {card.definition}</p>
            <p><strong>Examples:</strong></p>
            <ul>{card.examples.map((ex, j) => <li key={j}>{ex}</li>)}</ul>
            <p><strong>Notes:</strong> {card.notes}</p>
          </div>
        ))
      )}
    </div>
  );
}

// Ana uygulama
export default function App() {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    fetch(DATA_URL)
      .then(res => res.json())
      .then(data => setFlashcards(data))
      .catch(console.error);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Flashcards flashcards={flashcards} />} />
        <Route path="/search" element={<SearchPage flashcards={flashcards} />} />
      </Routes>
    </Router>
  );
}
