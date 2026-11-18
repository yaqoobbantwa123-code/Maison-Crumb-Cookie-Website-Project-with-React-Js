import classicChip from '../assets/products/classic-chip.jpg'
import midnightCocoa from '../assets/products/midnight-cocoa.jpg'
import velvetRouge from '../assets/products/velvet-rouge.jpg'
import goldenGrind from '../assets/products/golden-grind.jpg'
import creamCrumb from '../assets/products/cream-crumb.jpg'
import saltedCaramel from '../assets/products/salted-caramel.jpg'
import maisonSignature from '../assets/products/maison-signature.jpg'
import pistachioRose from '../assets/products/pistachio-rose.jpg'

export const categories = [
  {
    name: 'Chocolate Chip',
    image: classicChip,
    description: 'The original. Brown butter, dark chocolate, sea salt.',
  },
  {
    name: 'Double Chocolate',
    image: midnightCocoa,
    description: 'Cocoa on cocoa, with a molten dark centre.',
  },
  {
    name: 'Red Velvet',
    image: velvetRouge,
    description: 'Soft crumb, white chocolate, cream cheese finish.',
  },
  {
    name: 'Peanut Butter',
    image: goldenGrind,
    description: 'Deeply roasted peanuts and a crackled sugar top.',
  },
  {
    name: 'Cookies & Cream',
    image: creamCrumb,
    description: 'Vanilla dough, cocoa biscuit, white chocolate.',
  },
  {
    name: 'Salted Caramel',
    image: saltedCaramel,
    description: 'Burnt caramel, brown butter and fleur de sel.',
  },
  {
    name: 'Signature Collection',
    image: maisonSignature,
    description: 'Our most considered recipes, finished by hand.',
  },
]

export const collectionEdits = [
  {
    id: 'chocolate',
    index: '01',
    title: 'The Chocolate Edit',
    subtitle: 'Deep, dark and entirely unapologetic.',
    image: midnightCocoa,
    href: '/shop?category=Double%20Chocolate',
    align: 'left',
  },
  {
    id: 'signature',
    index: '02',
    title: 'The Signature Edit',
    subtitle: 'Six recipes. One very particular maison.',
    image: maisonSignature,
    href: '/shop?category=Signature%20Collection',
    align: 'right',
  },
  {
    id: 'botanical',
    index: '03',
    title: 'The Botanical Edit',
    subtitle: 'Pistachio, rose, honey and lavender.',
    image: pistachioRose,
    href: '/shop?category=Signature%20Collection',
    align: 'left',
  },
]

export const boxFlavours = [
  'classic-chip',
  'midnight-cocoa',
  'velvet-rouge',
  'golden-grind',
  'cream-crumb',
  'salted-caramel',
  'maison-signature',
  'pistachio-rose',
  'brown-butter-toffee',
  'espresso-noir',
  'honey-lavender',
  'maple-pecan',
]
