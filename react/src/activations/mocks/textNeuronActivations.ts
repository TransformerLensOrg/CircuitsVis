const text: string = `
  A goose (PL: geese) is a bird of any of several waterfowl species in the family Anatidae. This group comprises the genera Anser (the grey geese and white geese) and Branta (the black geese). Some other birds, mostly related to the shelducks, have "goose" as part of their names. More distantly related members of the family Anatidae are swans, most of which are larger than true geese, and ducks, which are smaller.

  The term "goose" may refer to either a male or female bird, but when paired with "gander", refers specifically to a female one (the latter referring to a male). Young birds before fledging are called goslings.[1] The collective noun for a group of geese on the ground is a gaggle; when in flight, they are called a skein, a team, or a wedge; when flying close together, they are called a plump.[2]
  Contents

      1 Etymology
      2 True geese and their relatives
      3 Fossil record
      4 Migratory patterns
          4.1 Preparation
          4.2 Navigation
          4.3 Formation
      5 Other birds called "geese"
      6 In popular culture
          6.1 "Gray Goose Laws" in Iceland
      7 Gallery
      8 See also
      9 References
      10 Further reading
      11 External links

  Etymology

  The word "goose" is a direct descendant of,*ghans-. In Germanic languages, the root gave Old English gōs with the plural gēs and gandres (becoming Modern English goose, geese, gander, and gosling, respectively), Frisian goes, gies and guoske, New High German Gans, Gänse, and Ganter, and Old Norse gās.

  This term also gave Lithuanian: žąsìs, Irish: gé (goose, from Old Irish géiss), Hindi: कलहंस, Latin: anser, Spanish: ganso, Ancient Greek: χήν (khēn), Dutch: gans, Albanian: gatë swans), Finnish: hanhi, Avestan zāō, Polish: gęś, Romanian: gâscă / gânsac, Ukrainian: гуска / гусак (huska / husak), Russian: гусыня / гусь (gusyna / gus), Czech: husa, and Persian: غاز (ghāz).[1][3]
  True geese and their relatives
  Snow geese (Anser caerulescens) in Quebec, Canada
  Chinese geese (Anser cygnoides domesticus), the domesticated form of the swan goose (Anser cygnoides)
  Barnacle geese (Branta leucopsis) in Naantali, Finland

  The two living genera of true geese are: Anser, grey geese and white geese, such as the greylag goose and snow goose, and Branta, black geese, such as the Canada goose.

  Two genera of geese are only tentatively placed in the Anserinae; they may belong to the shelducks or form a subfamily on their own: Cereopsis, the Cape Barren goose, and Cnemiornis, the prehistoric New Zealand goose. Either these or, more probably, the goose-like coscoroba swan is the closest living relative of the true geese.

  Fossils of true geese are hard to assign to genus; all that can be said is that their fossil record, particularly in North America, is dense and comprehensively documents many different species of true geese that have been around since about 10 million years ago in the Miocene. The aptly named Anser atavus (meaning "progenitor goose") from some 12 million years ago had even more plesiomorphies in common with swans. In addition, some goose-like birds are known from subfossil remains found on the Hawaiian Islands.

  Geese are monogamous, living in permanent pairs throughout the year; however, unlike most other permanently monogamous animals, they are territorial only during the short nesting season. Paired geese are more dominant and feed more, two factors that result in more young.[4][5]

  Geese honk while in flight to encourage other members of the flock to maintain a 'v-formation' and to help communicate with one another.[6]
  Fossil record

  Geese fossils have been found ranging from 10 to 12 million years ago (Middle Miocene). Garganornis ballmanni from Late Miocene (~ 6-9 Ma) of Gargano region of central Italy, stood one and a half meters tall and weighed about 22 kilograms. The evidence suggests the bird was flightless, unlike modern geese.[7]
  Migratory patterns

  Geese like the Canada goose do not always migrate.[8] Some members of the species only move south enough to ensure a supply of food and water. When European settlers came to America, the birds were seen as easy prey and were almost wiped out of the population. The species was reintroduced across the northern U.S. range and their population has been growing ever since.[9]
  Preparation
`;

function chunkText(textArr: string[]): string[][] {
  const chunks: string[][] = [];
  let i = 0;
  // Split textArr into 12 chunks of 75 tokens
  const chunkSize = 75;
  while (i < textArr.length) {
    chunks.push(textArr.slice(i, i + chunkSize));
    i += chunkSize;
  }
  return chunks;
}

export const mockTokens: string[][] = chunkText(text.split(/(?=\s)/));

const numLayers: number = 2;
const numNeurons: number = 3;
function createRandom3DActivationMatrix(shape: number[]) {
  return Array.from(Array(shape[0]), () =>
    Array.from(Array(shape[1]), () =>
      Array.from(Array(shape[2]), () => Math.random())
    )
  );
}
export const mockActivations: number[][][][] = mockTokens.map((tokens) => {
  return createRandom3DActivationMatrix([tokens.length, numLayers, numNeurons]);
});

export const neuronLabels: string[] = ["3", "9", "42"];
