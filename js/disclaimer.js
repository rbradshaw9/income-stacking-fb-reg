/**
 * Disclaimer Module
 * Injects legal disclaimer into page footer
 */

const DISCLAIMER_TEXT = `Tanner Training LLC is providing this training and any related materials (including newsletters, blog posts, and other communications) for educational purposes only. We are not providing legal, accounting, or financial advisory services, and this is not a solicitation or recommendation to buy or sell any stocks, options, or other financial instruments or investments. Examples that address specific assets, stocks, options, or transactions are for illustrative purposes only and may not represent specific trades or transactions that we have conducted. In fact, we may use examples that are different to or the opposite of transactions we have conducted or positions we hold. This training is not intended as a solicitation for any future relationship between the students or participants and the trainer. No express or implied warranties are being made with respect to these services and products. There is no guarantee that use of any of the services or products will result in a profit. All investing and trading in the securities markets involves risk, including the risk of loss. All investing decisions are personal and should only be made after thorough research and the engagement of professional assistance to the extent you believe necessary.`;

export function initDisclaimer() {
    const disclaimerElement = document.querySelector('[data-disclaimer]');
    
    if (disclaimerElement) {
        disclaimerElement.textContent = DISCLAIMER_TEXT;
        console.log('[Disclaimer] ✅ Loaded from module');
    } else {
        console.warn('[Disclaimer] No element with data-disclaimer attribute found');
    }
}
