export interface OfferItem {
  id: string
  title: string
  price: string
  description: string
}

export interface Benefit {
  icon: string
  title: string
  description: string
}

export interface Step {
  number: number
  title: string
  description: string
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  gradient: string
}

export interface FAQItem {
  question: string
  answer: string
}
