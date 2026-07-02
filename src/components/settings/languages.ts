export type AppLanguage = {
  value: string
  label: string
}

// wired: sumber daftar bahasa aplikasi. Saat ini statik; tim i18n dapat
// menggantinya dengan daftar locale yang didukung oleh Intlayer.
export const languages: AppLanguage[] = [
  { value: "en", label: "English (United States)" },
  { value: "fr", label: "français (France)" },
  { value: "de", label: "Deutsch (Deutschland)" },
  { value: "hi", label: "हिन्दी (भारत)" },
  { value: "id", label: "Indonesia (Indonesia)" },
  { value: "it", label: "italiano (Italia)" },
  { value: "ja", label: "日本語 (日本)" },
  { value: "ko", label: "한국어(대한민국)" },
  { value: "pt", label: "português (Brasil)" },
  { value: "es", label: "español (España)" },
  { value: "zh", label: "中文 (中国)" },
  { value: "ru", label: "Русский (Россия)" },
  { value: "ms", label: "Bahasa Melayu (Malaysia)" },
  { value: "vi", label: "Tiếng Việt (Việt Nam)" },
  { value: "tr", label: "Türkçe (Türkiye)" },
]

export const defaultLanguage = "en"
