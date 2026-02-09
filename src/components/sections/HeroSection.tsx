"use client";

export default function HeroSection() {
  const scrollToForm = () => {
    document.getElementById("create-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDemo = () => {
    document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-6xl sm:text-7xl mb-2">💝</div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
          Искаш ли да направиш{" "}
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            предложение, на което не могат да ти откажат
          </span>
          ?
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto">
          Създай персонализирана линк-покана, на която половинката ти
          не може да каже &bdquo;не&ldquo;. Буквално. 😏
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <button
            onClick={scrollToForm}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600
                       text-white font-semibold rounded-full text-lg transition-all duration-200
                       shadow-lg hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400
                       cursor-pointer"
          >
            Създай своята сега 💌
          </button>
          <button
            onClick={scrollToDemo}
            className="px-8 py-4 border-2 border-pink-300 text-pink-600 font-semibold rounded-full text-lg
                       hover:bg-pink-50 transition-all duration-200 active:scale-95 focus:outline-none
                       focus:ring-2 focus:ring-pink-400 cursor-pointer"
          >
            Виж примерна покана 👀
          </button>
        </div>
        <div className="pt-8 animate-bounce text-gray-400 text-2xl">↓</div>
      </div>
    </section>
  );
}
