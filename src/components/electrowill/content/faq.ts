// ---------------------------------------------------------------------------
// ElectroWill — FAQ content (single source of truth). Phase D.
// ---------------------------------------------------------------------------
// Rendered BOTH as the visible "Întrebări frecvente" accordion (FaqAccordion)
// and as FAQPage JSON-LD (ElectroWillJsonLd) — one array, no drift. Plain
// Romanian, low reading level; folds in the brief's validated colloquial
// search phrases ("vreau curent la casă", "faceți și la sat", "n-am curent pe
// teren", "să-mi pună contor/ceas", "să-mi pună stâlp") for relatability + SEO,
// plus the plain priză-de-pământ explainer (safety = trust).
//
// Never labelled "FAQ" in the UI — the heading is Romanian.
// ---------------------------------------------------------------------------

export interface FaqItem {
  q: string
  a: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Vreau curent la casă — de unde încep?',
    a: 'Ne suni sau ne scrii pe WhatsApp. Venim, vedem ce e nevoie și îți spunem clar pașii. De acte ne ocupăm noi.',
  },
  {
    q: 'Cât durează un branșament?',
    a: 'Depinde de avize și de operator, dar ne ocupăm noi de toate hârtiile ca să meargă cât mai repede. Îți dăm un termen realist după ce vedem situația.',
  },
  {
    q: 'Trebuie să mă ocup eu de acte?',
    a: 'Nu. Facem totul „la cheie": dosarul, ATR-ul și relația cu operatorul de distribuție. Tu doar semnezi unde e nevoie.',
  },
  {
    q: 'Faceți și la sat, pe teren fără curent?',
    a: 'Da. Acoperim tot județul Bistrița-Năsăud, inclusiv comunele. Dacă pe teren nu e curent, venim și îți spunem ce se poate face.',
  },
  {
    q: 'Îmi puneți contor și stâlp?',
    a: 'Da. Ne ocupăm de branșamentul complet — de la stâlp și coborârea cablului până la firidă și contorul montat.',
  },
  {
    q: 'De ce e importantă priza de pământ?',
    a: 'Te protejează de electrocutare dacă apare o defecțiune. E obligatorie — o montăm corect și primești buletinul de verificare.',
  },
  {
    q: 'Dați garanție?',
    a: 'Da. Primești certificat de garanție și declarația de conformitate, conform legii.',
  },
]
