"use client";

import CreateForm from "@/components/CreateForm";
import ScrollReveal from "@/components/ScrollReveal";

/**
 * Create invitation form section.
 *
 * Perf notes:
 * - content-visibility: auto skips rendering when section is off-screen.
 * - contain-intrinsic-size prevents layout shift when content becomes visible.
 */
export default function CreateSection() {
  return (
    <section
      id="create-section"
      className="py-20 px-4"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 800px",
      }}
    >
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <ScrollReveal>
          <div>
            <div className="inline-block text-4xl mb-3 animate-breathe">💌</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Създай своята покана
            </h2>
            <p className="text-gray-500">
              Попълни детайлите и получи уникален линк за твоята валентинка!
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8
                         magnetic-hover">
            <CreateForm />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
