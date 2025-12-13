export default function Collaboration() {
  return (
    <section className="py-24 max-w-5xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-6">Jak wygląda współpraca</h2>
      <p className="text-gray-600 mb-14">
        Prosty i przejrzysty proces, dzięki któremu wiesz dokładnie,
        na jakim etapie jest Twój projekt.
      </p>

      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-bold mb-2">1. Kontakt</h3>
          <p className="text-gray-600">
            Rozmawiamy o Twoich potrzebach, celach strony i oczekiwaniach.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">2. Projekt</h3>
          <p className="text-gray-600">
            Przygotowujemy koncepcję i wygląd strony dopasowany do branży.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">3. Wdrożenie</h3>
          <p className="text-gray-600">
            Kodujemy stronę, optymalizujemy ją i testujemy na różnych urządzeniach.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">4. Publikacja</h3>
          <p className="text-gray-600">
            Uruchamiamy stronę i przekazujemy gotowy projekt.
          </p>
        </div>
      </div>
    </section>
  );
}
