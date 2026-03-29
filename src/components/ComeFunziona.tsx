export default function ComeFunziona() {
  const steps = [
    {
      icon: "📝",
      titolo: "Scrivi la lista",
      descrizione:
        "Inserisci i prodotti che devi comprare, uno alla volta o incollando tutta la lista.",
      colore: "bg-blue-50 border-blue-100",
      iconBg: "bg-blue-100",
    },
    {
      icon: "📍",
      titolo: "Inserisci il CAP",
      descrizione:
        "Indica il tuo codice postale così troviamo i supermercati vicino a te.",
      colore: "bg-purple-50 border-purple-100",
      iconBg: "bg-purple-100",
    },
    {
      icon: "🔍",
      titolo: "Analisi prezzi",
      descrizione:
        "Confrontiamo i prezzi di Lidl, Esselunga, Conad, Eurospin e Coop per ogni prodotto.",
      colore: "bg-orange-50 border-orange-100",
      iconBg: "bg-orange-100",
    },
    {
      icon: "💰",
      titolo: "Risparmia subito",
      descrizione:
        "Scopri dove conviene fare la spesa e quanto puoi risparmiare ogni settimana.",
      colore: "bg-green-50 border-green-100",
      iconBg: "bg-green-100",
    },
  ];

  return (
    <section id="come-funziona" className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900">Come funziona</h2>
        <p className="text-gray-500 mt-2 text-lg">
          Quattro semplici passi per risparmiare sulla spesa
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`relative border rounded-2xl p-6 ${step.colore} transition-transform hover:-translate-y-1`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-10 h-10 ${step.iconBg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}
              >
                {step.icon}
              </div>
              <span className="text-3xl font-black text-gray-200 select-none">
                {i + 1}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              {step.titolo}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {step.descrizione}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
