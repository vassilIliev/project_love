"use client";

import InvitationCard from "@/components/InvitationCard";

export default function DemoSection() {
  return (
    <section id="demo-section">
      <InvitationCard
        recipientName="Маги"
        time="14.02 19:30"
        place="В италианския ресторант"
        extraMessage="Облечи нещо топло 💘"
        isDemo={true}
        fullScreen={true}
      />
    </section>
  );
}
