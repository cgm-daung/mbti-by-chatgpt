import html2canvas from 'html2canvas'

/**
 * DOM အပိုင်းကို PNG အဖြစ် ဒေါင်းလုဒ်လုပ်သည် (Noto Sans Myanmar သုံးပါက ဖောင့် ထည့်သွင်းထားရပါမည်)
 */
export async function downloadResultPng(element, filename = 'mbti-result.png') {
  if (!element) throw new Error('export element မရှိပါ')
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })
  const link = document.createElement('a')
  link.download = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  link.href = canvas.toDataURL('image/png')
  link.click()
}
