export const buildWhatsAppUrl = (phone: string, giftWish: string): string => {
  const message = `Meu desejo de presente para os 30 anos é: ${giftWish.trim()} ✨`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export const openWhatsAppWish = (phone: string, giftWish: string): void => {
  try {
    if (!giftWish.trim()) {
      throw new Error('Escreva seu desejo antes de enviar.')
    }

    const url = buildWhatsAppUrl(phone, giftWish)
    window.location.assign(url)
  } catch (error) {
    console.error('[whatsapp] Não foi possível abrir o WhatsApp.', error)
    throw error
  }
}
