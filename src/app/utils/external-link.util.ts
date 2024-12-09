/**
 * Navega a un enlace externo de la aplicación
 * @param {string} link url a navegar
 */
export function goToExternalLink(link: string): void {
  window.open(link, '_blank');
}
