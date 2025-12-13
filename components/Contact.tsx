'use client';

import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    budget: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert('Dziękujemy! Skontaktujemy się wkrótce.');
    setForm({
      name: '',
      email: '',
      phone: '',
      type: '',
      budget: '',
      message: '',
    });
  };

  return (
    <section id="kontakt" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6">
          Darmowa wycena strony
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Wypełnij formularz — odpowiemy z wyceną i propozycją rozwiązania.
          To nic nie kosztuje i do niczego nie zobowiązuje.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow space-y-6"
        >
          <div>
            <label className="block mb-1 font-medium">Imię i nazwisko *</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Adres e-mail *</label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Telefon (opcjonalnie)</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Rodzaj strony *</label>
            <select
              required
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            >
              <option value="">Wybierz</option>
              <option>Strona wizytówka</option>
              <option>Strona firmowa</option>
              <option>Landing page</option>
              <option>Sklep internetowy</option>
              <option>Jeszcze nie wiem</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Budżet (opcjonalnie)</label>
            <select
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            >
              <option value="">Nie wiem / do ustalenia</option>
              <option>do 1000 zł</option>
              <option>1000 – 2000 zł</option>
              <option>2000 – 3000 zł</option>
              <option>3000 zł +</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Opisz krótko czego potrzebujesz *
            </label>
            <textarea
              required
              rows={4}
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Wyślij zapytanie
          </button>
        </form>
      </div>
    </section>
  );
}
