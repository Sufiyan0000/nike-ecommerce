import Card from "../../components/Card";
import { parseQuery } from "@/src/lib/utils/query";
import { getProducts } from "@/src/services/products";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const query = parseQuery(resolvedSearchParams);
  const products = await getProducts(query);

  return (
    <main className="mx-auto w-full  md:max-w-7xl sm:px-2 lg:px-8">
      <section aria-labelledby="latest" className="pb-12">
        <h2
          id="latest"
          className=" text-heading-2 text-center text-dark-900 my-10"
        >
          Latest Shoes
        </h2>

        <div className="w-full md:w-max-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-5 px-2 md:px-5 overflow-hidden">
          {products.map((product: any) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
