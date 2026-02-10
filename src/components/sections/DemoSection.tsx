"use client";

import InvitationCard from "@/components/InvitationCard";
import { useTranslations } from "@/i18n/context";

export default function DemoSection() {
  const dict = useTranslations();

  return (
    <section id="demo-section">
      <InvitationCard
        recipientName={dict.demo.recipientName}
        time={dict.demo.time}
        place={dict.demo.place}
        extraMessage={dict.demo.extraMessage}
        isDemo={true}
        fullScreen={true}
      />
    </section>
  );
}
