import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const dailyWisdomVerses = [
  {
    verse: "Shri Guru Charan Saroj Raj, Nij Man Mukuru Sudhari",
    verseHi: "श्री गुरु चरन सरोज रज, निज मन मुकुरु सुधरि",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Barnaum Raghubar Bimal Jasu, Jo Dayaku Phal Chari",
    verseHi: "बरनाउँ रघुबर बिमल जसु, जो दायकु फल चारि",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Jai Hanuman Gyan Gun Sagar, Jai Kapis Tihun Lok Ujagar",
    verseHi: "जय हनुमान ज्ञान गुण सागर, जय कपीस तिहुँ लोक उजागर",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Ram Doot Atulit Bal Dhama, Anjani Putra Pavan Sut Nama",
    verseHi: "राम दूत अतुलित बल धामा, अंजनि पुत्र पवन सुत नामा",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Mahabir Bikram Bajrangi, Kumati Nivar Sumati Ke Sangi",
    verseHi: "महाबीर बिक्रम बजरंगी, कुमति निवार सुमति के संगी",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Kanchan Baran Viraj Subesa, Kanan Kundal Kunchit Kesa",
    verseHi: "कंचन बरन विराज सुबेसा, कानन कुंडल कुंचित केसा",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Hat Vajra Aur Dhwaja Virajai, Kandhe Moonj Janeu Sajai",
    verseHi: "हाथ वज्र औ ध्वजा विरजै, कंधे मूँज जनेउ सजै",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Shankar Suvan Kesari Nandan, Tej Pratap Maha Jag Bandhan",
    verseHi: "शंकर सुवन केसरी नंदन, तेज प्रताप महा जग बंदन",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Vidyavan Guni Ati Chatur, Ram Kaj Karibe Ko Aatur",
    verseHi: "विद्यावान गुणी अति चातुर, राम काज करिबे को आतुर",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Prabhu Charitra Sunibe Ko Rasiya, Ram Lakhan Sita Man Basiya",
    verseHi: "प्रभु चरित्र सुनिबे को रसिया, राम लखन सीता मन बसिया",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Sukshma Roop Dhari Siyahi Dikhava, Vikat Roop Dhari Langh Sagar Jawa",
    verseHi: "सूक्ष्म रूप धरि सियहि दिखावा, विकट रूप धरि लंक जरावा",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Bhim Roop Dhari Asur Sanghare, Ramachandra Ke Kaj Sanvare",
    verseHi: "भीम रूप धरि असुर संघारे, रामचंद्र के काज संवारे",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Laye Sanjivan Lakhan Jiyaye, Shri Raghuvir Harashi Ur Laye",
    verseHi: "लाय संजीवन लखन जियाये, श्री रघुबीर हरषि उर लाये",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Raghupati Kinh Bahut Badhai, Tum Mam Priya Bharat Hi Sam Bhai",
    verseHi: "रघुपति कीन्ही बहुत बढाई, तुम मम प्रिय भरतहि सम भाई",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Tahasam Asti Kaji Jagat Ke Jete, Suman Nivedan Karu Kete",
    verseHi: "तहासम अस्ति काजि जगत के जेते, सुमन निवेदन करु केते",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Tum Mere Ho Prabhu, Main Aapka Bhakt",
    verseHi: "तुम मेरे हो प्रभु, मैं आपका भक्त",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Jai Jai Jai Hanuman Gosai, Kripa Karahu Gurudev Ki Nai",
    verseHi: "जय जय जय हनुमान गोसाईं, कृपा करहु गुरुदेव की नाईं",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Jo Satbar Path Kar Koi, Chhutahi Bandi Maha Sukh Hoi",
    verseHi: "जो सतबार पाठ कर कोई, छूटहिं बंदि महा सुख होई",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Jo Yeh Padhe Hanuman Chalisa, Hoye Siddhi Sakhi Gaurisa",
    verseHi: "जो यह पढ़े हनुमान चालीसा, होय सिद्धि साखी गौरीसा",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Tulsidas Sada Hari Chera, Keejai Nath Hriday Mah Dera",
    verseHi: "तुलसीदास सदा हरि चेरा, कीजै नाथ हृदय मह डेरा",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Pavan Tanay Sankat Haran, Mangal Murti Roop",
    verseHi: "पवन तनय संकट हरन, मंगल मूरति रूप",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop",
    verseHi: "राम लखन सीता सहित, हृदय बसहु सुर भूप",
    source: "Hanuman Chalisa",
  },
  {
    verse: "Manojavam Marutatulyavegam, Jitendriyam Buddhimatam Varishtam",
    verseHi: "मनोजवं मारुततुल्यवेगं, जितेन्द्रियं बुद्धिमतां वरिष्ठम",
    source: "Hanuman Dhyana Shloka",
  },
  {
    verse: "Vataatmajam Vanaraayuthamukhyam, Shreeramadootam Sharannam Prapadye",
    verseHi: "वातात्मजं वानरयूथमुख्यं, श्रीरामदूतं शरणं प्रपद्ये",
    source: "Hanuman Dhyana Shloka",
  },
  {
    verse: "Shri Ram Jai Ram Jai Jai Ram",
    verseHi: "श्री राम जय राम जय जय राम",
    source: "Ram Mantra",
  },
  {
    verse: "Om Hanumate Namah",
    verseHi: "ॐ हनुमते नमः",
    source: "Hanuman Mantra",
  },
  {
    verse: "Jai Shri Ram, Jai Hanuman",
    verseHi: "जय श्री राम, जय हनुमान",
    source: "Devotional Mantra",
  },
  {
    verse: "Bolo Jai Shri Ram Ki, Jai",
    verseHi: "बोलो जय श्री राम की, जय",
    source: "Devotional Mantra",
  },
  {
    verse: "Sita Ram Sita Ram Sita Ram Kaho, Hanuman Ji Hanuman Ji Hanuman Ji Kaho",
    verseHi: "सीता राम सीता राम सीता राम कहो, हनुमान जी हनुमान जी हनुमान जी कहो",
    source: "Devotional Mantra",
  },
  {
    verse: "Hey Ram, Hey Ram, Hey Ram Hey",
    verseHi: "हे राम, हे राम, हे राम हे",
    source: "Devotional Mantra",
  },
  {
    verse: "Ram Siya Ram Siya Ram Jai Jai Ram",
    verseHi: "राम सिया राम सिया राम जय जय राम",
    source: "Devotional Mantra",
  },
  {
    verse: "Shri Ram Chandra Kripalu Bhaju Man, Haran Bhav Bhitar Bun Kamiun",
    verseHi: "श्री राम चन्द्र कृपालु भजु मन, हरण भव भितर बुन कामिउन",
    source: "Ramcharitmanas",
  },
]

async function main() {
  console.log("Seeding daily wisdom verses...")

  for (const verse of dailyWisdomVerses) {
    await prisma.dailyWisdom.create({
      data: verse,
    })
  }

  console.log(`Seeded ${dailyWisdomVerses.length} daily wisdom verses`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
