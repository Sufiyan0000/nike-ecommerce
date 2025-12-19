import { parseQuery } from "@/src/lib/utils/query";
import { getProducts } from "@/src/services/products";
import Filters from "@/src/components/Filters";
import Sort from "@/src/components/Sort";
import Card from "@/src/components/Card";

type Props = {
  searchParams: Record<string, string | string[]>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const query = parseQuery(searchParams);
  const products = await getProducts(query);

  console.log('API URL:',process.env.Next_PUBLIC_API_URL);

  return (
    <div className="flex gap-6">
      <aside className="hidden md:block w-64">
        <Filters />
      </aside>

      <main className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Products</h1>
          <Sort />
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found 😕</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product: any) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
