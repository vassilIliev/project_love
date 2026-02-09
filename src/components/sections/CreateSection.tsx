"use client";

import CreateForm from "@/components/CreateForm";

export default function CreateSection() {
  return (
    <section id="create-section" className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Създай своята 💌
          </h2>
          <p className="text-gray-500">
            Попълни детайлите и получи уникален линк за твоята валентинка!
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8">
          <CreateForm />
        </div>
      </div>
    </section>
  );
}
