"use client";

import { useState } from "react";
import {
  Search, ShoppingBag, Heart, Leaf,
  Sparkles, ArrowRight, X, Send
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Bamboo Toothbrush Set",
    category: "Personal Care",
    price: 249,
    tag: "Plastic Free",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=700",
    description: "Natural bamboo handle and recyclable packaging."
  },
  {
    id: 2,
    name: "Reusable Glass Bottle",
    category: "Lifestyle",
    price: 499,
    tag: "Reusable",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700",
    description: "A reusable bottle for everyday hydration."
  },
  {
    id: 3,
    name: "Organic Cotton Tote",
    category: "Fashion",
    price: 399,
    tag: "Organic",
    image: "https://images.unsplash.com/photo-1597484662317-c9257e6f8c4a?w=700",
    description: "Everyday carry bag made with organic cotton."
  },
  {
    id: 4,
    name: "Natural Skincare",
    category: "Personal Care",
    price: 699,
    tag: "Plant Based",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700",
    description: "A gentle skincare essential."
  },
  {
    id: 5,
    name: "Bamboo Kitchen Set",
    category: "Home",
    price: 599,
    tag: "Plastic Alternative",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=700",
    description: "Reusable kitchen essentials."
  },
  {
    id: 6,
    name: "Recycled Notebook",
    category: "Stationery",
    price: 199,
    tag: "Recycled",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700",
    description: "Notebook made using recycled paper."
  }
];

const categories = [
  "All", "Personal Care", "Fashion",
  "Home", "Lifestyle", "Stationery"
];

export default function Home() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [chat, setChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your ECORA assistant 🌿 Tell me what sustainable products you're looking for!"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const filtered = products.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const text = message;
    setMessage("");

    const updated = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(updated);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          products
        })
      });

      const data = await response.json();

      setMessages(old => [
        ...old,
        {
          role: "assistant",
          content: data.reply || data.error || "Please try again."
        }
      ]);
    } catch {
      setMessages(old => [
        ...old,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="announcement">
        SMALL CHOICES. GREENER FUTURE. 🌿
      </div>

      <header className="navbar">
        <a className="logo" href="#">ecora<span>.</span></a>

        <nav>
          <a href="#shop">SHOP</a>
          <a href="#categories">CATEGORIES</a>
          <a href="#about">OUR PURPOSE</a>
        </nav>

        <div className="nav-icons">
          <button onClick={() => setWishlist([])} aria-label="Clear wishlist">
            <Heart />
            {wishlist.length}
          </button>
          <button aria-label="Shopping bag">
            <ShoppingBag />
            {cart.length}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">A BETTER WAY TO SHOP</p>
          <h1>Good for you.<br />
            <em>Gentler on Earth.</em>
          </h1>
          <p>
            Discover thoughtful everyday products
            that make sustainable living feel simple,
            beautiful and affordable.
          </p>
          <a href="#shop" className="primary">
            Explore collection <ArrowRight size={17} />
          </a>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200"
            alt="Green sustainable lifestyle"
          />
        </div>
      </section>

      <section className="values" id="about">
        <div><Leaf /><b>Conscious choices</b><small>Thoughtful products</small></div>
        <div><Sparkles /><b>Everyday essentials</b><small>Made for real life</small></div>
        <div><Heart /><b>Less waste</b><small>More mindful living</small></div>
      </section>

      <section className="shop" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE ECORA COLLECTION</p>
            <h2>Shop the <em>good stuff.</em></h2>
          </div>
          <p>Little switches. Meaningful habits.</p>
        </div>

        <div className="filters" id="categories">
          {categories.map(c => (
            <button
              key={c}
              className={category === c ? "selected" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}

          <label className="search">
            <Search size={17} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Find something..."
            />
          </label>
        </div>

        <div className="product-grid">
          {filtered.map(product => (
            <article className="product" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <span className="tag">{product.tag}</span>

                <button
                  className="wishlist"
                  onClick={() => setWishlist(old =>
                    old.includes(product.id)
                      ? old.filter(id => id !== product.id)
                      : [...old, product.id]
                  )}
                  aria-label="Toggle wishlist"
                >
                  <Heart fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="product-info">
                <div>
                  <h3>{product.name}</h3>
                  <small>{product.category}</small>
                </div>
                <b>₹{product.price}</b>
              </div>

              <p className="description">{product.description}</p>

              <button
                className="add-button"
                onClick={() => setCart(old => [...old, product.id])}
              >
                ADD TO BAG +
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-section">
        <div>
          <p className="eyebrow">MEET YOUR GREEN SHOPPING ASSISTANT</p>
          <h2>Not sure what to choose?<br />
            <em>Ask ECORA AI.</em>
          </h2>
          <p>
            Find alternatives to everyday products,
            discover sustainable materials and
            get personalised shopping recommendations.
          </p>
          <button className="primary" onClick={() => setChat(true)}>
            Chat with AI <Sparkles size={17} />
          </button>
        </div>
        <Leaf size={130} strokeWidth={0.7} />
      </section>

      <footer>
        <a className="logo" href="#">ecora<span>.</span></a>
        <p>Shop consciously. Live greener.</p>
        <small>© 2026 ECORA. A MORE MINDFUL MARKETPLACE.</small>
      </footer>

      <button className="floating-ai" onClick={() => setChat(true)}>
        <Sparkles size={18} /> Ask ECORA AI
      </button>

      {chat && (
        <div className="chat-overlay">
          <div className="chat-box">
            <div className="chat-header">
              <div>
                <Leaf />
                <b>ECORA AI</b>
              </div>
              <button onClick={() => setChat(false)} aria-label="Close chat">
                <X />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((m, i) => (
                <div className={`bubble ${m.role}`} key={i}>
                  {m.content}
                </div>
              ))}
              {loading && <div className="bubble assistant">Thinking...</div>}
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              sendMessage();
            }}>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ask about eco-friendly products..."
              />
              <button disabled={loading || !message.trim()} aria-label="Send">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
