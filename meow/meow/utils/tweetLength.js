export const TWEET_LIMIT = 280;
export const STORY_URL_RESERVED = 24;

const URL_REGEX = /https?:\/\/[^\s]+/gi;

const EMOJI_REGEX = /(?:\p{Regional_Indicator}{2})|(?:[0-9#*]\uFE0F?\u20E3)|(?:\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})*(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})*)*)/gu;

const isLight = cp =>
  cp <= 0x10ff ||
  (cp >= 0x2000 && cp <= 0x200d) ||
  (cp >= 0x2010 && cp <= 0x201f) ||
  (cp >= 0x2032 && cp <= 0x2037);

export function getTweetLength(text, hasStoryUrl) {
  if (!text) return 0;

  const reserved = hasStoryUrl ? STORY_URL_RESERVED : 0;

  let rest = text.normalize("NFC");
  let length = 0;

  const urls = rest.match(URL_REGEX) || [];
  length += urls.length * 23;
  rest = rest.replace(URL_REGEX, "");

  const emoji = rest.match(EMOJI_REGEX) || [];
  length += emoji.length * 2;
  rest = rest.replace(EMOJI_REGEX, "");

  for (const char of rest) {
    length += isLight(char.codePointAt(0)) ? 1 : 2;
  }

  return length + reserved;
}
