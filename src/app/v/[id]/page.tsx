import { notFound } from "next/navigation";
import { decodeInvitation } from "@/lib/invitation-codec";
import InvitationCard from "@/components/InvitationCard";

interface InvitationPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { id } = await params;

  const invitation = decodeInvitation(decodeURIComponent(id));

  if (!invitation) {
    notFound();
  }

  return (
    <InvitationCard
      recipientName={invitation.recipientName}
      time={invitation.time}
      place={invitation.place}
      extraMessage={invitation.extraMessage}
    />
  );
}
