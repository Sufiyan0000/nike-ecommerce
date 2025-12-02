import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import { products } from "../../data";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <section aria-labelledby="latest" className="pb-12">

        <h2 id="latest" className=" text-heading-2 text-center text-dark-900 my-10">
          Latest Shoes
        </h2>

        <div className="w-full md:w-max-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-5  px-20 md:px-5 overflow-hidden">
          {products.map((p) => (
            
              <Card 
            key={p.id}
            title={p.title}
            subtitle={p.subtitle}
            meta={p.meta}
            imageSrc={p.imageSrc}
            imageAlt={p.imageAlt}
            badgeLabel={p.badgeLabel}
            price={p.price}
            />
          
            
          ))}
        </div>

      </section>
    </main>
  );
}
