import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
return (
<>
<Navbar/>
<div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-4">Welcome to Gulime</h1>
  <p className="text-lg">Discover amazing products and deals!</p>
</div>
<Footer/>
</>
);
}
