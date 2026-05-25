with open("/opt/football-world/app/live/channels/channels-content.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'import { getChannelsWithProxy, fetchIPTVChannels, iptvToChannel, FALLBACK_CHANNELS } from "@/lib/streaming";',
    'import { fetchIPTVChannels, iptvToChannel, getChannels } from "@/lib/streaming";'
)
content = content.replace(
    "const fallback = getChannelsWithProxy();",
    "const fallback = getChannels();"
)

with open("/opt/football-world/app/live/channels/channels-content.tsx", "w") as f:
    f.write(content)
print("Fixed")
