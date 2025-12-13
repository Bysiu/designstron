import { benefits } from '@/lib/data';

export default function Benefits() {
  return (
    <section className="py-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {benefits.map((b, i) => (
        <div key={i} className="p-6 border rounded-lg text-center">
          <div className="text-4xl mb-2">{b.icon}</div>
          <h3 className="font-bold">{b.title}</h3>
          <p className="text-gray-600">{b.description}</p>
        </div>
      ))}
    </section>
  );
}