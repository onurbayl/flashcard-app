import React, { useState, useEffect } from "react";

const DATA_URL = "https://raw.githubusercontent.com/onurbayl/data/refs/heads/main/data.json";

export default function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch(DATA_URL)
      .then(res => res.json())
      .then(data => setFlashcards(data))
      .catch(console.error);
  }, []);

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

  if (flashcards.length === 0) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  const card = flashcards[index];

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <div
        onClick={() => setShowDetails(!showDetails)}
        style={{ border: "1px solid #ccc", borderRadius: 12, padding: 20, cursor: "pointer", background: "#fff" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{card.word}</h2>

        {showDetails && (
          <>
            <p style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "6px" }}>
              Definition:
            </p>
            <p style={{ marginLeft: "12px", marginBottom: "12px", lineHeight: "1.4" }}>
              {card.definition}
            </p>

            <p style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "6px" }}>
              Examples:
            </p>
            <div style={{ marginLeft: "20px", marginBottom: "12px", lineHeight: "1.4" }}>
              {card.examples.map((ex, i) => (
                <p key={i} style={{ marginBottom: "6px" }}>
                  • {ex}
                </p>
              ))}
            </div>

            <p
              style={{
                fontStyle: "italic",
                backgroundColor: "#f0f8ff",
                padding: "8px 12px",
                borderRadius: "8px",
                color: "#333",
                marginTop: "10px",
                lineHeight: "1.4",
              }}
            >
              Notes: {card.notes}
            </p>
          </>
        )}
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button
          onClick={prevCard}
          disabled={index === 0}
          style={{
            marginRight: 10,
            backgroundColor: "#FFD700", // Sarı (Gold)
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: index === 0 ? "not-allowed" : "pointer",
            color: "#000",
            fontWeight: "600",
          }}
        >
          Önceki
        </button>

        <button
          onClick={nextCard}
          disabled={finished}
          style={{
            backgroundColor: "#4CAF50", // Yeşil
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: finished ? "not-allowed" : "pointer",
            color: "#fff",
            fontWeight: "600",
          }}
        >
          Sonraki
        </button>
      </div>

      {finished && (
        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            color: "green",
            fontWeight: "700",
            fontSize: "1.2rem",
          }}
        >
          Tebrikler, tüm kartlar bitti!
        </p>
      )}
    </div>
  );
}
