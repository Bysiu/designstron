export default function Maintenance() {
  return (
    <section id="opieka" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Nagłówek */}
        <h2 className="text-4xl font-bold text-center text-text mb-4">
          Opieka nad stroną po wdrożeniu
        </h2>
        <p className="text-center text-text-light mb-12 text-lg max-w-3xl mx-auto">
          Strona może działać samodzielnie, ale jeśli chcesz mieć spokój i pewność,
          że wszystko jest aktualne i bezpieczne — możemy zająć się nią za Ciebie.
        </p>

        {/* Karty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* BASIC */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-text mb-2">
              Pakiet Basic
            </h3>
            <p className="text-3xl font-bold text-primary mb-4">
              99 zł <span className="text-base font-medium text-text-light">/ mies.</span>
            </p>

            <ul className="space-y-3 text-text-light mb-6">
              <li>• aktualizacja treści (teksty, zdjęcia)</li>
              <li>• drobne poprawki na stronie</li>
              <li>• kopia zapasowa strony</li>
              <li>• aktualizacje techniczne</li>
            </ul>

            <p className="text-sm text-text-light">
              Idealny dla małych firm, które chcą mieć aktualną stronę
              bez zaglądania do panelu.
            </p>
          </div>

          {/* STANDARD */}
          <div className="bg-primary/5 p-8 rounded-xl border-2 border-primary hover:shadow-xl transition-all duration-300 scale-105">
            <h3 className="text-2xl font-bold text-text mb-2">
              Pakiet Standard
            </h3>
            <p className="text-3xl font-bold text-primary mb-4">
              199 zł <span className="text-base font-medium text-text-light">/ mies.</span>
            </p>

            <ul className="space-y-3 text-text-light mb-6">
              <li>• wszystko z pakietu Basic</li>
              <li>• regularne dodawanie treści</li>
              <li>• optymalizacja szybkości strony</li>
              <li>• wsparcie mailowe</li>
            </ul>

            <p className="text-sm text-text-light">
              Najczęściej wybierany pakiet. Dla firm, które chcą,
              żeby strona faktycznie „żyła”.
            </p>
          </div>

          {/* PREMIUM */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-text mb-2">
              Pakiet Premium
            </h3>
            <p className="text-3xl font-bold text-primary mb-4">
              349 zł <span className="text-base font-medium text-text-light">/ mies.</span>
            </p>

            <ul className="space-y-3 text-text-light mb-6">
              <li>• wszystko z pakietu Standard</li>
              <li>• nielimitowane zmiany treści</li>
              <li>• priorytetowe wsparcie</li>
              <li>• podstawowe SEO (meta, nagłówki)</li>
            </ul>

            <p className="text-sm text-text-light">
              Dla firm, które chcą mieć pełne wsparcie i święty spokój.
            </p>
          </div>
        </div>

        {/* Dopisek */}
        <p className="text-center text-text-light mt-12 max-w-3xl mx-auto">
          Nie wiesz, który pakiet wybrać?  
          Podczas rozmowy doradzimy najlepsze rozwiązanie — bez zobowiązań.
        </p>
      </div>
    </section>
  );
}
