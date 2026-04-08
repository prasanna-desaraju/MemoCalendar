const monthImages = [
  "https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516557070061-c3d1653fa646?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=1200&q=80"
];

function HeroPanel({ monthLabel, monthIndex }) {
  const imageUrl = monthImages[monthIndex % 12];

  return (
    <section className="hero-panel">
      <div className="spiral" />
      <div className="hero-image" style={{ "--hero-image-url": `url(${imageUrl})` }}>
        <div className="hero-overlay">
          <p className="hero-year">{new Date().getFullYear()}</p>
          <h1>{monthLabel}</h1>
        </div>
      </div>
    </section>
  );
}

export default HeroPanel;
