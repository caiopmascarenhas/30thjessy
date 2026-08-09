const bufferToHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

export const sha256 = async (value: string): Promise<string> => {
  try {
    const encodedValue = new TextEncoder().encode(value)
    const digest = await window.crypto.subtle.digest('SHA-256', encodedValue)

    return bufferToHex(digest)
  } catch (error) {
    console.error('[auth] Não foi possível validar a senha.', error)
    throw new Error('Não foi possível validar a senha neste navegador.', { cause: error })
  }
}
