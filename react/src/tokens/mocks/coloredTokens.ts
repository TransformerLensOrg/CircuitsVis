export const mockTokens = [
  "class",
  " Reddit",
  ":",
  "\n ",
  " update",
  "_",
  "checked",
  " =",
  " False",
  "\n ",
  " _",
  "rat",
  "el",
  "imit",
  "_",
  "regex",
  " =",
  " re",
  ".",
  "compile",
  "(",
  "r",
  '"',
  "([",
  "0",
  "-",
  "9",
  "]{",
  "1",
  ",",
  "3",
  "})",
  " (",
  "mill",
  "iseconds",
  "?",
  "|",
  "seconds",
  "?",
  "|",
  "minutes",
  "?)",
  '")',
  "\n\n ",
  " @",
  "property",
  "\n ",
  " def",
  " _",
  "next",
  "_",
  "unique",
  "(",
  "self",
  ")",
  " ->",
  " int",
  ":",
  "\n ",
  " value",
  " =",
  " self",
  "._",
  "unique",
  "_",
  "counter",
  "\n ",
  " self",
  "._",
  "unique",
  "_",
  "counter",
  " +=",
  " 1",
  "\n ",
  " return",
  " value",
  "\n\n ",
  " @",
  "property",
  "\n ",
  " def",
  " read",
  "_",
  "only",
  "(",
  "self",
  ")",
  " ->",
  " bool",
  ":",
  "\n ",
  ' """',
  "Return",
  " ``",
  "True",
  "``",
  " when",
  " using",
  " the",
  " ``",
  "Read",
  "Only",
  "Author",
  "izer",
  "``",
  '."""',
  "\n ",
  " return",
  " self",
  "._",
  "core",
  " ==",
  " self",
  "._",
  "read",
  "_",
  "only",
  "_",
  "core",
  "\n\n ",
  " @",
  "read",
  "_",
  "only",
  ".",
  "set",
  "ter",
  "\n ",
  " def",
  " read",
  "_",
  "only",
  "(",
  "self",
  ",",
  " value",
  ":",
  " bool",
  ")",
  " ->",
  " None",
  ":",
  "\n ",
  ' """',
  "Set",
  " or",
  " un",
  "set",
  " the",
  " use",
  " of",
  " the",
  " Read",
  "Only",
  "Author",
  "izer",
  ".",
  "\n ",
  " :",
  "ra",
  "ises",
  ":",
  " :",
  "class",
  ":",
  "`.",
  "Client",
  "Exception",
  "`",
  " when",
  " attempting",
  " to",
  " un",
  "set",
  " ``",
  "read",
  "_",
  "only",
  "``",
  " and",
  "\n ",
  " only",
  " the",
  " ``",
  "Read",
  "Only",
  "Author",
  "izer",
  "``",
  " is",
  " available",
  ".",
  "\n ",
  ' """',
  "\n ",
  " if",
  " value",
  ":",
  "\n ",
  " self",
  "._",
  "core",
  " =",
  " self",
  "._",
  "read",
  "_",
  "only",
  "_",
  "core",
  "\n ",
  " elif",
  " self",
  "._",
  "authorized",
  "_",
  "core",
  " is",
  " None",
  ":",
  "\n ",
  " raise",
  " Client",
  "Exception",
  "(",
  "\n ",
  ' "',
  "read",
  "_",
  "only",
  " cannot",
  " be",
  " un",
  "set",
  " as",
  " only",
  " the",
  " Read",
  "Only",
  "Author",
  "izer",
  " is",
  " available",
  '."',
  "\n ",
  " )",
  "\n ",
  " else",
  ":",
  "\n ",
  " self",
  "._",
  "core",
  " =",
  " self",
  "._",
  "authorized",
  "_",
  "core",
  "\n\n ",
  " @",
  "property",
  "\n ",
  " def",
  " validate",
  "_",
  "on",
  "_",
  "submit",
  "(",
  "self",
  ")",
  " ->",
  " bool",
  ":",
  "\n ",
  ' """',
  "Get",
  " validate",
  "_",
  "on",
  "_",
  "submit",
  ".",
  "\n ",
  "..",
  " deprecated",
  "::",
  " 7",
  ".",
  "0",
  "\n ",
  " If",
  " property",
  " :",
  "attr",
  ":",
  "`.",
  "validate",
  "_",
  "on",
  "_",
  "submit",
  "`",
  " is",
  " set",
  " to",
  " ``",
  "False",
  "``",
  ",",
  " the",
  " behavior",
  " is",
  "\n ",
  " deprecated",
  " by",
  " Reddit",
  ".",
  " This",
  " attribute",
  " will",
  " be",
  " removed",
  " around",
  " May",
  "-",
  "June",
  " 2",
  "0",
  "2",
  "0",
  ".",
  "\n ",
  ' """',
  "\n ",
  " value",
  " =",
  " self",
  "._",
  "validate",
  "_",
  "on",
  "_",
  "submit",
  "\n ",
  " if",
  " value",
  " is",
  " False",
  ":",
  "\n ",
  " warn",
  "(",
  "\n ",
  ' "',
  "Red",
  "dit",
  " will",
  " check",
  " for",
  " validation",
  " on",
  " all",
  " posts",
  " around",
  " May",
  "-",
  "June",
  " 2",
  "0",
  "2",
  "0",
  ".",
  " It",
  '"',
  "\n ",
  ' "',
  " is",
  " recommended",
  " to",
  " check",
  " for",
  " validation",
  " by",
  " setting",
  '"',
  "\n ",
  ' "',
  " redd",
  "it",
  ".",
  "validate",
  "_",
  "on",
  "_",
  "submit",
  " to",
  " True",
  '.",',
  "\n ",
  " category",
  "=",
  "Dep",
  "rec",
  "ation",
  "Warning",
  ",",
  "\n ",
  " stack",
  "level",
  "=",
  "3",
  ",",
  "\n ",
  " )",
  "\n ",
  " return"
];

export const mockValues = [
  0.0000006219, 0.0145308562, -0.1404035836, 0.0001031339, -0.0181442499,
  0.0000425652, 0.4676490724, 0.0379571021, -0.1879520416, -0.007731745,
  0.0000087938, -0.0127301402, 0.2066464573, 0.0776088983, 0.0006695495,
  -0.2520848811, -0.0823620856, -0.0334108472, 0.245113492, -0.1432019472,
  -0.0066892505, -0.0300149024, -0.009421261, -0.0221996512, 0.5490510464,
  -0.1218788922, 0.0105798542, 0.0484184623, 0.0801258683, -0.0239099413,
  -0.0197054446, 0.0011228092, 0.0000681803, 0.2287244499, 0.0063738613,
  -0.0005307829, 0.0139577975, 0.2580736578, 0.6625726223, -0.0009637121,
  0.066787228, 0.2879539132, 0.1427007169, -0.007757809, 0.1295484602,
  0.0134078264, -0.0097765326, -0.0366173349, -0.0000446837, 0.0205183029,
  -0.0000258216, 0.1400976628, 0.0655861497, 0.0012099133, -0.0720179677,
  -0.0070694387, 0.1904485226, 0.0582311749, -0.003322866, -0.0540601015,
  0.1502584517, 0.1261327267, -0.0011224833, -0.4380444586, 0.0069346358,
  0.0386789814, -0.0245163366, -0.2321336865, -0.0314541124, -0.08843261,
  0.9286111593, -0.1562622041, 0.1237872243, 0.1001729071, 0.024910897,
  0.5526285768, 0.0023488998, -0.2850846946, 0.0118290782, 0.0058026314,
  0.0047158003, 0.0006096047, -0.0790141821, 0.011721639, 0.1362534761,
  0.0091130733, -0.2058984935, 0.0454577208, 0.1273727119, 0.1381959319,
  0.0429062247, -0.0642386526, 0.1462859362, -0.0010326442, 0.2920421362,
  0.002445817, -0.0018207836, 0.004715913, -0.0230856687, 0.0407866389,
  0.0010117516, 0.5489981771, -0.0001264173, 0.0007876776, 0.2675945163,
  0.4242863953, -0.0210899711, 0.2453442812, 0.0855717659, -0.0085759163,
  -0.000562535, 0.000116363, 0.0085016415, 0.0134009123, -0.0005975422,
  0.2166460752, 0.2984373569, -0.2958423793, -0.0008974103, 0.2694529295,
  -0.1098018885, 0.0134821096, 0.5570789576, 0.117154181, 0.3000327051,
  0.4688822627, 0.1061223745, -0.0078112483, -0.0078518391, 0.8520200253,
  0.1286870837, 0.3439406753, 0.1901453137, 0.0072892308, 0.0131719112,
  0.2396282405, 0.010022047, -0.3157484233, 0.0698616207, -0.0080025792,
  -0.1726672649, 0.1600424647, 0.0671297312, 0.2149727941, 0.0894118994,
  0.0005835033, -0.0000675181, 0.0946147144, 0.0470751151, -0.0010825,
  0.131246388, 0.045971334, 0.0011529038, 0.6017510891, 0.7375714779,
  0.9098120332, -0.0137378313, 0.0703185946, 0.0590063371, -0.0246331077,
  -0.0027519464, -0.0677859783, 0.0881179646, -0.1653440893, -0.0123041077,
  -0.286318779, -0.000936829, 0.1067639887, 0.2747517526, 0.0903260782,
  0.0810994208, 0.013060689, 0.0007890144, 0.9062747359, -0.009627467,
  0.0792724416, 0.0516216159, 0.0196556449, 0.1200390458, -0.0026325649,
  0.0102911554, 0.0018374863, 0.1356917173, -0.0386384428, 0.7473417521,
  0.1174088717, 0.942612648, 0.8944275379, 0.5595457554, -0.0744787753,
  -0.0371254981, 0.4966602921, 0.4688055515, 0.1482989192, 0.286432147,
  0.1191697195, 0.0031747962, 0.5068869591, 0.0697489977, 0.2824061513,
  -0.0376368165, 0.0198621545, 0.1926025301, 0.413629055, -0.0337253809,
  0.4140422344, 0.2303587794, 0.0281034708, -0.0063169599, 0.6945232749,
  0.1411154866, 0.0252213627, -0.4500791132, 0.0029962659, -0.0000003174,
  -0.2665536106, 0.0001449844, 0.0666593164, 0.125900805, -0.2045109272,
  -0.0008355975, -0.0386986323, -0.0000711503, 0.5098578334, 0.1436619163,
  -0.1012291908, 0.0344754159, 0.0561907329, 0.4081306159, 0.0034198165,
  0.0003852564, -0.3534452617, 0.0014236877, 0.9586799145, 0.0012088121,
  0.0009353122, 0.0330252498, 0.0019751845, 0.2715310454, 0.8898829818,
  0.836817503, 0.0882308781, -0.0037925355, 0.313105762, -0.2465211898,
  0.6578400135, 0.0435889363, -0.1754517257, -0.0080716014, 0.0057964921,
  0.0600164458, 0.0766673684, 0.7506139874, 0.6541926265, 0.6603399515,
  0.0395969152, 0.0000002805, 0.203969419, 0.5281766057, 0.435046792,
  0.1880384684, -0.79277879, 0.0236440301, 0.0015734434, 0.0020925375,
  -0.0624228716, -0.0024808338, -0.0582574606, 0.0018162932, 0.1995362043,
  0.0034110546, -0.1866874397, 0.1613387465, 0.4188560545, 0.0775891542,
  0.1022245288, 0.1870539784, 0.0052574091, 0.0025829612, 0.1834496558,
  0.73578161, 0.2195843458, 0.8987259865, 0.0121229813, -0.0303361509,
  0.0002931431, -0.0195899308, -0.2794342637, 0.0003327613, 0.0898362398,
  0.226510331, -0.108599633, -0.0014194585, -0.0000567417, 0.0033046999,
  0.1063713953, -0.0404051207, 0.0553080775, -0.0005358383, -0.1770697832,
  0.262383461, 0.175275743, 0.6111828685, 0.1434824914, 0.3208144009,
  -0.012219294, -0.1834220886, 0.0149550941, 0.1380700469, -0.0015727878,
  0.2584753931, -0.0277175345, 0.0003288229, 0.0949437171, 0.0207306352,
  -0.0049975035, 0.0035048975, 0.0000889587, 0.1136212647, -0.0034325775,
  0.0000552796, 0.1600628495, 0.0297037363, -0.1841051579, -0.0000346369,
  0.0025556006, 0.0020889556, 0.0079352856, -0.1264779866, 0.319478184,
  0.0008403971, 0.1294415742, 0.0411299765, 0.1301106811, 0.090507865,
  0.059785068, 0.0036087139, 0.3591989875, 0.3647009134, 0.071782589,
  -0.0264552459, -0.0083175302, 0.3546337485, 0.0599297881, 0.3915102482,
  0.0252607167, 0.1225005835, 0.471676141, -0.4233388901, 0.0037213129,
  -0.0658706427, 0.0143287778, -0.0000618782, 0.0446123667, 0.4080998302,
  0.5767087936, -0.001053106, 0.0884372517, -0.0042287335, 0.0034043523,
  0.0120782629, 0.0006982221, -0.0016106404, -0.0076557342, 0.0115865655,
  -0.0003337541, 0.0219879113, 0.8558861017, 0.5967720747, 0.4480031729,
  0.4373111129, 0.8445559144, 0.9268567562, 0.3059120774, 0.0063580293,
  0.0000039492, 0.2881910205, 0.3730633855, 0.0017905204, 0.0016960911,
  -0.1373336017, -0.0334244072, 0.0517534427, 0.1390397102, -0.0196680874,
  -0.001462996, 0.0013619808, 0.2718190253, 0.8149151802, 0.0000475792,
  -0.2028101683, -0.0254933126, -0.0419868752, 0.1284008026, 0.3714885116,
  0.3263232112, 0.3687552214, 0.0001573412, 0.0150237354, 0.0031800342,
  -0.0472598076, -0.0021545473, 0.1496221721, -0.0023701997, -0.1677999645,
  -0.0129204392, 0.0103296041, 0.094870463, -0.2831195295, 0.008339718,
  0.2930948734, 0.1508107185, 0.0295093879, 0.0405177772, 0.0641460866,
  0.2621290684, 0.1435324848, 0.0173472911, 0.2825519443
];
