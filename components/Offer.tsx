import { offers } from '@/lib/data';

export default function Offer() {
  return (
    <section id="oferta" className="py-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-10">Oferta</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {offers.map(o => (
          <div key={o.id} className="p-6 border rounded-lg">
            <h3 className="font-bold text-xl">{o.title}</h3>
            <p className="text-blue-600">{o.price}</p>
            <p className="text-gray-600">{o.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
