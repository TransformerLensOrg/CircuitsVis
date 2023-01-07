// eslint-disable-file @typescript-eslint/no-loss-of-precision

export const mockPrompt: string[] = [
  "<|endoftext|>",
  "Help",
  " I",
  "'m",
  " stuck",
  " in",
  " a",
  " visualization"
];

export const mockTopKLogProbs: number[][] = [
  [
    -2.775820016860962, -3.2781002521514893, -3.7249996662139893,
    -3.942326784133911, -3.9997074604034424, -4.458617210388184,
    -4.482804298400879, -4.697758674621582, -4.749497413635254,
    -4.858040809631348
  ],
  [
    -1.391688585281372, -2.3606274127960205, -3.058157205581665,
    -3.403547525405884, -3.4692556858062744, -3.8481075763702393,
    -3.8692429065704346, -4.189271926879883, -4.297833442687988,
    -4.344714164733887
  ],
  [
    -3.0140724182128906, -3.3914690017700195, -3.742039680480957,
    -3.7773818969726562, -3.863231658935547, -3.9578418731689453,
    -3.9916257858276367, -4.056523323059082, -4.161242485046387,
    -4.1985063552856445
  ],
  [
    -2.3803369998931885, -2.5158798694610596, -3.166353464126587,
    -3.8034136295318604, -4.214130401611328, -4.295816421508789,
    -4.3793487548828125, -4.5147247314453125, -4.625791549682617,
    -4.64068603515625
  ],
  [
    -1.3285123109817505, -1.881179928779602, -2.1619110107421875,
    -3.1402435302734375, -3.1468944549560547, -3.572294235229492,
    -3.591092109680176, -3.5914440155029297, -4.020899772644043,
    -4.11892032623291
  ],
  [
    -1.4879289865493774, -2.106163501739502, -2.652275562286377,
    -2.894700527191162, -3.462658405303955, -3.6862130165100098,
    -4.833212375640869, -4.870670795440674, -4.921427249908447,
    -5.028660297393799
  ],
  [
    -3.9793872833251953, -4.258188247680664, -4.501413345336914,
    -4.567808151245117, -4.581555366516113, -4.589099884033203,
    -4.65826416015625, -4.695440292358398, -4.793856620788574,
    -4.809090614318848
  ],
  [
    -2.309892177581787, -2.5258841514587402, -2.565032482147217,
    -3.2880377769470215, -3.416806697845459, -3.5045418739318848,
    -3.5323243141174316, -3.673673152923584, -3.8714165687561035,
    -3.9652562141418457
  ]
];

export const mockTopKTokens: string[][] = [
  ["\n", "The", '"', "A", "I", "In", ".", "It", "S", "This"],
  [
    " us",
    " me",
    "ful",
    "!",
    " Us",
    " support",
    "\n",
    " spread",
    " the",
    " keep"
  ],
  ["'m", " am", " Can", " Am", " Know", " get", " Have", " have", ".", " Need"],
  [
    " not",
    " a",
    " Not",
    " in",
    " on",
    " an",
    " going",
    " A",
    " looking",
    " the"
  ],
  [" in", " with", " on", " at", "?", ",", ".", " here", "\n", " and"],
  [
    " a",
    " the",
    " this",
    " my",
    " an",
    " traffic",
    " your",
    " that",
    " one",
    " school"
  ],
  [
    " bad",
    " loop",
    " weird",
    " situation",
    " place",
    " world",
    " car",
    " strange",
    " box",
    " room"
  ],
  [" of", "?", " problem", " that", ",", " mode", ".", " for", " with", " and"]
];

export const mockCorrectTokenRank: number[] = [680, 118, 0, 211, 0, 0, 7127];

export const mockCorrectTokenLogProb: number[] = [
  -8.586348533630371, -7.552104949951172, -3.0140724182128906,
  -7.391904830932617, -1.3285123109817505, -1.4879289865493774,
  -11.700347900390625
];
