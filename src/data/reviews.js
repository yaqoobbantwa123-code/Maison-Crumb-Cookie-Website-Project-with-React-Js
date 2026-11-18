export const testimonials = [
  {
    id: 'r1',
    name: 'Isabelle Moreau',
    location: 'Paris, FR',
    rating: 5,
    title: 'The most elegant cookie I have eaten.',
    body:
      'I ordered the Signature box for a dinner party and ended up hiding the last one in my study. The texture is extraordinary — crisp at the edge, almost custard-soft in the middle. It feels like something from a patisserie, not a cookie brand.',
    product: 'The Maison Signature',
    initials: 'IM',
    verified: true,
  },
  {
    id: 'r2',
    name: 'Theo Bennett',
    location: 'London, UK',
    rating: 5,
    title: 'My weekly ritual.',
    body:
      'The Classic Chip arrives on Fridays and is gone by Sunday. The salt is what does it — it stops the sweetness just short of too much. I have tried a lot of so-called luxury cookies; this is the only one I reorder.',
    product: 'The Classic Chip',
    initials: 'TB',
    verified: true,
  },
  {
    id: 'r3',
    name: 'Amara Okafor',
    location: 'New York, US',
    rating: 5,
    title: 'A gift that actually feels considered.',
    body:
      'I sent a box to my mother for her birthday. She called me twice: once to say it was too beautiful to open, and once to say she had opened it and eaten three. The packaging is genuinely beautiful.',
    product: 'The Signature Box',
    initials: 'AO',
    verified: true,
  },
  {
    id: 'r4',
    name: 'Lucas Ferreira',
    location: 'Lisbon, PT',
    rating: 4.5,
    title: 'Salted Caramel No. 7 is a problem.',
    body:
      'A very good problem. The caramel is properly dark, not just sweet, and the salt is generous. I would like to say I shared them. I did not.',
    product: 'Salted Caramel No. 7',
    initials: 'LF',
    verified: true,
  },
  {
    id: 'r5',
    name: 'Sofia Lindqvist',
    location: 'Stockholm, SE',
    rating: 5,
    title: 'Understated, beautiful, delicious.',
    body:
      'Nothing about MAISON CRUMB shouts. The flavours are precise and the boxes are lovely enough to leave out on the counter. The pistachio and rose cookie is the most interesting thing I have baked-adjacent eaten all year.',
    product: 'Pistachio & Rose',
    initials: 'SL',
    verified: true,
  },
  {
    id: 'r6',
    name: 'Hana Ito',
    location: 'Tokyo, JP',
    rating: 5,
    title: 'Worth the wait.',
    body:
      'I ordered from Tokyo and the box arrived in perfect condition, wrapped like a small present. The Espresso Noir is my favourite — grown-up, bitter-sweet and not too rich. I am already planning my next order.',
    product: 'Espresso Noir',
    initials: 'HI',
    verified: true,
  },
]

export const productReviews = [
  {
    id: 'pr1',
    productId: 'classic-chip',
    name: 'Theo Bennett',
    location: 'London, UK',
    rating: 5,
    title: 'The salt makes it.',
    body:
      'Crisp edge, soft centre, and that hit of Maldon salt. I have ordered four boxes in two months. Enough said.',
    date: '12 October 2026',
    initials: 'TB',
    verified: true,
  },
  {
    id: 'pr2',
    productId: 'classic-chip',
    name: 'Clara Nguyen',
    location: 'Melbourne, AU',
    rating: 5,
    title: 'Better warm, somehow.',
    body:
      'Twenty seconds in a low oven and it tastes like it has just come out of the bakery. The chocolate is proper chocolate, not chips.',
    date: '3 October 2026',
    initials: 'CN',
    verified: true,
  },
  {
    id: 'pr3',
    productId: 'midnight-cocoa',
    name: 'Ravi Menon',
    location: 'Singapore, SG',
    rating: 5,
    title: 'Intensely chocolatey.',
    body:
      'Not too sweet, which I appreciate. The espresso note is subtle but it keeps the whole thing from becoming one-note.',
    date: '28 September 2026',
    initials: 'RM',
    verified: true,
  },
  {
    id: 'pr4',
    productId: 'salted-caramel',
    name: 'Lucas Ferreira',
    location: 'Lisbon, PT',
    rating: 5,
    title: 'A very good problem.',
    body:
      'The caramel is dark and almost savoury. The salt is generous. I would like to say I shared them. I did not.',
    date: '19 September 2026',
    initials: 'LF',
    verified: true,
  },
  {
    id: 'pr5',
    productId: 'maison-signature',
    name: 'Isabelle Moreau',
    location: 'Paris, FR',
    rating: 5,
    title: 'A small, perfect thing.',
    body:
      'The texture is extraordinary — crisp at the edge, almost custard-soft in the middle. It feels like something from a patisserie.',
    date: '14 September 2026',
    initials: 'IM',
    verified: true,
  },
  {
    id: 'pr6',
    productId: 'pistachio-rose',
    name: 'Sofia Lindqvist',
    location: 'Stockholm, SE',
    rating: 5,
    title: 'Understated and beautiful.',
    body:
      'The rose is a whisper, not a perfume. The pistachio is properly toasted. This is the most interesting cookie in the collection.',
    date: '8 September 2026',
    initials: 'SL',
    verified: true,
  },
  {
    id: 'pr7',
    productId: 'espresso-noir',
    name: 'Hana Ito',
    location: 'Tokyo, JP',
    rating: 5,
    title: 'Grown-up and bitter-sweet.',
    body:
      'The cocoa nibs give it a lovely crunch. It is not too rich, which is rare for a double chocolate cookie. I am already planning my next order.',
    date: '2 September 2026',
    initials: 'HI',
    verified: true,
  },
  {
    id: 'pr8',
    productId: 'cream-crumb',
    name: 'Amelia Hart',
    location: 'Edinburgh, UK',
    rating: 5,
    title: 'Tastes like the last spoonful.',
    body:
      'Creamy, crunchy and just a little nostalgic. My children have requested these instead of birthday cake, which I am taking as a compliment.',
    date: '29 August 2026',
    initials: 'AH',
    verified: true,
  },
]

export const getProductReviews = (productId) =>
  productReviews.filter((review) => review.productId === productId)

export const getRatingBreakdown = (rating, count) => {
  const weights = [0.78, 0.16, 0.04, 0.015, 0.005]
  return [5, 4, 3, 2, 1].map((star, index) => ({
    star,
    count: Math.max(1, Math.round(count * weights[index])),
    percent: Math.round(weights[index] * 100),
  }))
}
