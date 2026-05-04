import { useEffect } from "react";
import "@/App.css";
import Nav from "@/components/site/Nav";
import ArticleHeader from "@/components/site/ArticleHeader";
import BlogPage from "@/components/site/BlogPage";
import Footer from "@/components/site/Footer";

function App() {
  useEffect(() => {
    let lenis;
    let raf;
    (async () => {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const loop = (time) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (lenis) lenis.destroy?.();
    };
  }, []);

  return (
    <div className="App relative">
      <Nav />
      <main>
        <ArticleHeader />
        <BlogPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
