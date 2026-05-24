import dynamic from "next/dynamic";

const ChannelsClient = dynamic(() => import("./channels-client"), { ssr: false });

export default function ChannelsPage() {
  return <ChannelsClient />;
}
