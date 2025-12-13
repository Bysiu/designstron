export default function Hero() {
  return (
    <section className="pt-32 pb-24 text-center max-w-5xl mx-auto px-4">
      <h1 className="text-5xl font-bold mb-6 leading-tight">
        Nowoczesne strony internetowe, <br />
        które realnie pomagają zdobywać klientów
      </h1>

      <p className="text-lg text-gray-600 mb-10 leading-relaxed">
        Projektujemy i wdrażamy estetyczne, szybkie i responsywne strony internetowe
        dla małych firm, freelancerów i lokalnych biznesów.  
        Bez zbędnych dodatków, bez przepłacania — konkretnie i skutecznie.
      </p>

      <div className="flex justify-center gap-6">
        <a
          href="#kontakt"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Darmowa wycena
        </a>
        <a
          href="#oferta"
          className="px-8 py-4 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Zobacz ofertę
        </a>
      </div>
    </section>
  );
}
