const MD5 = require("md5.js");
const JSON5 = require("json5");
const axios = require("axios");
const Util = require("../utils/slot_utils");
const EUtil = require("../utils/engine_utils");
axios.defaults.timeout = 10000;
const rtpConfig = {
    BuyBonusDefaultMulti: 10000, //bonus buy
    FreeMinMulti: 1000,   //min win jackpot
    JackpotNormalStart: 10, //min range to new bonuS
    JackpotNormalEnd: 20, //max range to new bonus
    JackpotLongPercent:50, // chance to big range
    JackpotLongStart: 30, //min range to new bonuS LONG
    JackpotLongEnd: 40, //max range to new bonus LONG
    SmallBaseMaxMulti: 1000, //max min win
};
const GameServers = {
    vs20doghouse: {
        apiManager: "../ReplayService/engine/machines/1_DogHouse/DogApiManager.js",
        machine: "../ReplayService/engine/machines/1_DogHouse/DogSlotMachine",
    },
    vs40pirate: {
        apiManager: "../ReplayService/engine/machines/2_PirateGold/PirateGoldApiManager",
        machine: "../ReplayService/engine/machines/2_PirateGold/PirateGoldSlotMachine",
    },
    vs25pyramid: {
        apiManager: "../ReplayService/engine/machines/3_PyramidKing/PyramidApiManager",
        machine: "../ReplayService/engine/machines/3_PyramidKing/PyramidSlotMachine",
    },
    vs20rhino: {
        apiManager: "../ReplayService/engine/machines/4_GreatRhino/GreatRhinoApiManager",
        machine: "../ReplayService/engine/machines/4_GreatRhino/GreatRhinoSlotMachine",
    },
    vs25pandagold: {
        apiManager: "../ReplayService/engine/machines/5_PandaFortune/PandaApiManager",
        machine: "../ReplayService/engine/machines/5_PandaFortune/PandaSlotMachine",
    },
    vs243mwarrior: {
        apiManager: "../ReplayService/engine/machines/6_MonkeyWarrior/MonkeyApiManager",
        machine: "../ReplayService/engine/machines/6_MonkeyWarrior/MonkeySlotMachine",
    },
    vs4096bufking: {
        apiManager: "../ReplayService/engine/machines/7_BuffaloKing/BuffaloApiManager",
        machine: "../ReplayService/engine/machines/7_BuffaloKing/BuffaloSlotMachine",
    },
    vs25aztecking: {
        apiManager: "../ReplayService/engine/machines/8_AztecKing/AztecKingApiManager",
        machine: "../ReplayService/engine/machines/8_AztecKing/AztecKingSlotMachine",
    },
    vs25jokerking: {
        apiManager: "../ReplayService/engine/machines/9_JokerKing/JokerKingApiManager",
        machine: "../ReplayService/engine/machines/9_JokerKing/JokerKingSlotMachine",
    },
    vs5ultrab: {
        apiManager: "../ReplayService/engine/machines/10_UltraBurn/UltraBurnApiManager",
        machine: "../ReplayService/engine/machines/10_UltraBurn/UltraBurnSlotMachine",
    },
    vs5ultra: {
        apiManager: "../ReplayService/engine/machines/11_UltraHold/UltraHoldApiManager",
        machine: "../ReplayService/engine/machines/11_UltraHold/UltraHoldSlotMachine",
    },
    vs10returndead: {
        apiManager: "../ReplayService/engine/machines/12_ReturnDead/ReturnDeadApiManager",
        machine: "../ReplayService/engine/machines/12_ReturnDead/ReturnDeadSlotMachine",
    },
    vs10madame: {
        apiManager: "../ReplayService/engine/machines/13_MadameDestiny/MadameDestinyApiManager",
        machine: "../ReplayService/engine/machines/13_MadameDestiny/MadameDestinySlotMachine",
    },
    vs15diamond: {
        apiManager: "../ReplayService/engine/machines/14_DiamondStrike/DiamondStrikeApiManager",
        machine: "../ReplayService/engine/machines/14_DiamondStrike/DiamondStrikeSlotMachine",
    },
    vs10bbbonanza: {
        apiManager: "../ReplayService/engine/machines/15_BigBassBonanza/BigBassApiManager",
        machine: "../ReplayService/engine/machines/15_BigBassBonanza/BigBassSlotMachine",
    },
    vs10cowgold: {
        apiManager: "../ReplayService/engine/machines/16_CowboysGold/CowboyApiManager",
        machine: "../ReplayService/engine/machines/16_CowboysGold/CowboySlotMachine",
    },
    vs25tigerwar: {
        apiManager: "../ReplayService/engine/machines/17_TheTigerWarrior/TheTigerWarriorApiManager",
        machine: "../ReplayService/engine/machines/17_TheTigerWarrior/TheTigerWarriorSlotMachine",
    },
    vs25wildspells: {
        apiManager: "../ReplayService/engine/machines/18_WildSpells/WildSpellsApiManager",
        machine: "../ReplayService/engine/machines/18_WildSpells/WildSpellsSlotMachine",
    },
    vs25mustang: {
        apiManager: "../ReplayService/engine/machines/19_MustangGold/MustangApiManager",
        machine: "../ReplayService/engine/machines/19_MustangGold/MustangSlotMachine",
    },
    vs25hotfiesta: {
        apiManager: "../ReplayService/engine/machines/20_Hotfiesta/HotfiestaApiManager",
        machine: "../ReplayService/engine/machines/20_Hotfiesta/HotfiestaSlotMachine",
    },
    vs243dancingpar: {
        apiManager: "../ReplayService/engine/machines/21_DanceParty/DancePartyApiManager",
        machine: "../ReplayService/engine/machines/21_DanceParty/DancePartySlotMachine",
    },
    vs20hburnhs: {
        apiManager: "../ReplayService/engine/machines/22_HotToBurn/HotToBurnApiManager",
        machine: "../ReplayService/engine/machines/22_HotToBurn/HotToBurnSlotMachine",
    },
    vs576treasures: {
        apiManager: "../ReplayService/engine/machines/23_WildWildRiches/RichesApiManager",
        machine: "../ReplayService/engine/machines/23_WildWildRiches/RichesSlotMachine",
    },
    vs20emptybank: {
        apiManager: "../ReplayService/engine/machines/24_EmptyTheBank/EmptyBankApiManager",
        machine: "../ReplayService/engine/machines/24_EmptyTheBank/EmptyBankSlotMachine",
    },
    vs20vegasmagic: {
        apiManager: "../ReplayService/engine/machines/25_VegasMagic/VegasMagicApiManager",
        machine: "../ReplayService/engine/machines/25_VegasMagic/VegasMagicSlotMachine",
    },
    vs20olympgate: {
        apiManager: "../ReplayService/engine/machines/26_GatesOfOlympus/OlympGateApiManager",
        machine: "../ReplayService/engine/machines/26_GatesOfOlympus/OlympGateSlotMachine",
    },
    vs20midas: {
        apiManager: "../ReplayService/engine/machines/27_TheHandOfMidas/TheHandOfMidasApiManager",
        machine: "../ReplayService/engine/machines/27_TheHandOfMidas/TheHandOfMidasSlotMachine",
    },
    vswayslight: {
        apiManager: "../ReplayService/engine/machines/28_LuckyLightning/LightningApiManager",
        machine: "../ReplayService/engine/machines/28_LuckyLightning/LightningSlotMachine",
    },
    vs20fruitparty: {
        apiManager: "../ReplayService/engine/machines/29_FruitParty/FruitPartyApiManager",
        machine: "../ReplayService/engine/machines/29_FruitParty/FruitPartySlotMachine",
    },
    vs20fparty2: {
        apiManager: "../ReplayService/engine/machines/30_FruitParty2/FruitPartyTwoApiManager",
        machine: "../ReplayService/engine/machines/30_FruitParty2/FruitPartyTwoSlotMachine",
    },
    vswaysdogs: {
        apiManager: "../ReplayService/engine/machines/31_DogHouseMegaways/DogHouseMegaApiManager",
        machine: "../ReplayService/engine/machines/31_DogHouseMegaways/DogHouseMegaSlotMachine",
    },
    vs50juicyfr: {
        apiManager: "../ReplayService/engine/machines/32_JuicyFruits/JuicyFruitsApiManager",
        machine: "../ReplayService/engine/machines/32_JuicyFruits/JuicyFruitsSlotMachine",
    },
    vs25pandatemple: {
        apiManager: "../ReplayService/engine/machines/33_PandaFotune2/Panda2ApiManager",
        machine: "../ReplayService/engine/machines/33_PandaFotune2/Panda2SlotMachine",
    },
    vswaysbufking: {
        apiManager: "../ReplayService/engine/machines/34_BuffaloKingMegaways/BuffaloMegaApiManager",
        machine: "../ReplayService/engine/machines/34_BuffaloKingMegaways/BuffaloMegaSlotMachine",
    },
    vs40wildwest: {
        apiManager: "../ReplayService/engine/machines/35_WildWestGold/WildWestApiManager",
        machine: "../ReplayService/engine/machines/35_WildWestGold/WildWestSlotMachine",
    },
    vswaysrhino: {
        apiManager: "../ReplayService/engine/machines/36_GreatRhinoMegaways/GreatRhinoMegaApiManager",
        machine: "../ReplayService/engine/machines/36_GreatRhinoMegaways/GreatRhinoMegaSlotMachine",
    },
    vs20sbxmas: {
        apiManager: "../ReplayService/engine/machines/37_SweetBonanzaXmas/SweetBonanzaXmasApiManager",
        machine: "../ReplayService/engine/machines/37_SweetBonanzaXmas/SweetBonanzaXmasSlotMachine",
    },
    vs40spartaking: {
        apiManager: "../ReplayService/engine/machines/38_SpartanKing/SpartanApiManager",
        machine: "../ReplayService/engine/machines/38_SpartanKing/SpartanSlotMachine",
    },
    vs20chickdrop: {
        apiManager: "../ReplayService/engine/machines/39_ChickenDrop/ChickenDropApiManager",
        machine: "../ReplayService/engine/machines/39_ChickenDrop/ChickenDropSlotMachine",
    },
    vs10fruity2: {
        apiManager: "../ReplayService/engine/machines/40_ExtraJuicy/ExtraJuicyApiManager",
        machine: "../ReplayService/engine/machines/40_ExtraJuicy/ExtraJuicySlotMachine",
    },
    vs10egypt: {
        apiManager: "../ReplayService/engine/machines/41_AncientEgypt/EgyptApiManager",
        machine: "../ReplayService/engine/machines/41_AncientEgypt/EgyptSlotMachine",
    },
    vs20tweethouse: {
        apiManager: "../ReplayService/engine/machines/42_TweetyHouse/42_TweetyHouseApiManager.js",
        machine: "../ReplayService/engine/machines/42_TweetyHouse/42_TweetyHouseMachine",
    },
    vs5drhs: {
        apiManager: "../ReplayService/engine/machines/43_DragonHoldandSpin/DragonhsApiManager",
        machine: "../ReplayService/engine/machines/43_DragonHoldandSpin/DragonhsSlotMachine",
    },
    vswayssamurai: {
        apiManager: "../ReplayService/engine/machines/44_SamuraiMegaways/SamuraiMegaApiManager",
        machine: "../ReplayService/engine/machines/44_SamuraiMegaways/SamuraiMegaSlotMachine",
    },
    vs12bbb: {
        apiManager: "../ReplayService/engine/machines/45_BiggerBassBonanza/BiggerBassApiManager",
        machine: "../ReplayService/engine/machines/45_BiggerBassBonanza/BiggerBassSlotMachine",
    },
    vswayslions: {
        apiManager: "../ReplayService/engine/machines/46_5LionsMegaways/LionsMegaApiManager",
        machine: "../ReplayService/engine/machines/46_5LionsMegaways/LionsMegaSlotmachine",
    },
    vs50pixie: {
        apiManager: "../ReplayService/engine/machines/47_PixieWings/PixieApiManager",
        machine: "../ReplayService/engine/machines/47_PixieWings/PixieSlotMachine",
    },
    vs10floatdrg: {
        apiManager: "../ReplayService/engine/machines/48_FloatingDragon/FloatingDragonApiManager",
        machine: "../ReplayService/engine/machines/48_FloatingDragon/FloatingDragonSlotMachine",
    },
    vs20fruitsw: {
        apiManager: "../ReplayService/engine/machines/49_SweetBonanza/SweetBonanzaApiManager",
        machine: "../ReplayService/engine/machines/49_SweetBonanza/SweetBonanzaSlotMachine",
    },
    vs20rhinoluxe: {
        apiManager: "../ReplayService/engine/machines/50_GreatRhinoDeluxe/GreatRhinoDeluxeApiManager",
        machine: "../ReplayService/engine/machines/50_GreatRhinoDeluxe/GreatRhinoDeluxeSlotMachine",
    },
    vs432congocash: {
        apiManager: "../ReplayService/engine/machines/51_CongoCash/CongoCashApiManager",
        machine: "../ReplayService/engine/machines/51_CongoCash/CongoCashSlotMachine",
    },
    vswaysmadame: {
        apiManager: "../ReplayService/engine/machines/52_MadameDestinyMegaways/MadameMegaApiManager",
        machine: "../ReplayService/engine/machines/52_MadameDestinyMegaways/MadameMegaSlotMachine",
    },
    vs1024temuj: {
        apiManager: "../ReplayService/engine/machines/53_TemujinTreasures/TemujinApiManager",
        machine: "../ReplayService/engine/machines/53_TemujinTreasures/TemujinSlotMachine",
    },
    vs40pirgold: {
        apiManager: "../ReplayService/engine/machines/54_PirateGoldDeluxe/PirateGoldDeluxeApiManager",
        machine: "../ReplayService/engine/machines/54_PirateGoldDeluxe/PirateGoldDeluxeSlotMachine",
    }, // 54
    vs25mmouse: {
        apiManager: "../ReplayService/engine/machines/55_MoneyMouse/MoneyMouseApiManager",
        machine: "../ReplayService/engine/machines/55_MoneyMouse/MoneyMouseSlotMachine",
    },
    vs10threestar: {
        apiManager: "../ReplayService/engine/machines/56_ThreeStarFortune/ThreeStarFortuneApiManager",
        machine: "../ReplayService/engine/machines/56_ThreeStarFortune/ThreeStarFortuneMachine",
    },
    vs1ball: {
        apiManager: "../ReplayService/engine/machines/57_LuckyDragonBall/LuckyDragonBallApiManager",
        machine: "../ReplayService/engine/machines/57_LuckyDragonBall/LuckyDragonBallSlotMachine",
    },
    vs243lionsgold: {
        apiManager: "../ReplayService/engine/machines/58_LionsGold/LionsGoldApiManager",
        machine: "../ReplayService/engine/machines/58_LionsGold/LionsGoldSlotMachine",
    },
    vs10egyptcls: {
        apiManager: "../ReplayService/engine/machines/59_AncientEgyptClassic/EgyptClassicApiManager",
        machine: "../ReplayService/engine/machines/59_AncientEgyptClassic/EgyptClassicSlotMachine",
    },
    vs25davinci: {
        apiManager: "../ReplayService/engine/machines/60_DaVinciTreasure/DaVinciTreasureApiManager",
        machine: "../ReplayService/engine/machines/60_DaVinciTreasure/DaVinciTreasureSlotMachine",
    },
    vs7776secrets: {
        apiManager: "../ReplayService/engine/machines/61_AztecTreasure/AztecTreasureApiManager",
        machine: "../ReplayService/engine/machines/61_AztecTreasure/AztecTreasureSlotMachine",
    },
    vs25wolfgold: {
        apiManager: "../ReplayService/engine/machines/62_WolfGold/WolfGoldApiManager",
        machine: "../ReplayService/engine/machines/62_WolfGold/WolfGoldSlotMachine",
    },
    vs50safariking: {
        apiManager: "../ReplayService/engine/machines/63_SafariKing/SafariKingApiManager",
        machine: "../ReplayService/engine/machines/63_SafariKing/SafariKingSlotMachine",
    },
    vs25peking: {
        apiManager: "../ReplayService/engine/machines/64_PekingLuck/PekingLuckApiManager",
        machine: "../ReplayService/engine/machines/64_PekingLuck/PekingLuckSlotMachine",
    },
    vs25asgard: {
        apiManager: "../ReplayService/engine/machines/65_Asgard/AsgardApiManager",
        machine: "../ReplayService/engine/machines/65_Asgard/AsgardSlotMachine",
    },
    vs25vegas: {
        apiManager: "../ReplayService/engine/machines/66_VegasNight/66_VegasNightApiManager",
        machine: "../ReplayService/engine/machines/66_VegasNight/66_VegasNightSlotMachine",
    },
    vs75empress: {
        apiManager: "../ReplayService/engine/machines/67_GoldenBeauty/GoldenBeautyApiManager",
        machine: "../ReplayService/engine/machines/67_GoldenBeauty/GoldenBeautySlotMachine",
    },
    vs25scarabqueen: {
        apiManager: "../ReplayService/engine/machines/68_ScarabQueen/ScarabQueenApiManager",
        machine: "../ReplayService/engine/machines/68_ScarabQueen/ScarabQueenSlotMachine",
    },
    vs20starlight: {
        apiManager: "../ReplayService/engine/machines/69_StarlightPrincess/StarlightApiManager",
        machine: "../ReplayService/engine/machines/69_StarlightPrincess/StarlightSlotMachine",
    },
    vs10bookoftut: {
        apiManager: "../ReplayService/engine/machines/70_BookofTut/BookofTutApiManager",
        machine: "../ReplayService/engine/machines/70_BookofTut/BookofTutSlotMachine",
    },
    vs9piggybank: {
        apiManager: "../ReplayService/engine/machines/71_PiggyBank/PiggyBankApiManager",
        machine: "../ReplayService/engine/machines/71_PiggyBank/PiggyBankSlotMachine",
    },
    vs5drmystery: {
        apiManager: "../ReplayService/engine/machines/72_DragonKingdom/DragonKingdomApiManager",
        machine: "../ReplayService/engine/machines/72_DragonKingdom/DragonKingdomSlotMachine",
    },
    vs20eightdragons: {
        apiManager: "../ReplayService/engine/machines/73_EightDragons/EightDragonsApiManager",
        machine: "../ReplayService/engine/machines/73_EightDragons/EightDragonsSlotMachine",
    },
    vs1024lionsd: {
        apiManager: "../ReplayService/engine/machines/74_LionsDance/LionsDanceApiManager",
        machine: "../ReplayService/engine/machines/74_LionsDance/LionsDanceSlotMachine",
    },
    vs25rio: {
        apiManager: "../ReplayService/engine/machines/75_HeartOfRio/HeartOfRioApiManager",
        machine: "../ReplayService/engine/machines/75_HeartOfRio/HeartOfRioSlotMachine",
    },
    vs10nudgeit: {
        apiManager: "../ReplayService/engine/machines/76_NudGeit/NudGeitApiManager",
        machine: "../ReplayService/engine/machines/76_NudGeit/NudGeitSlotMachine",
    },
    vs10bxmasbnza: {
        apiManager: "../ReplayService/engine/machines/77_ChrismasBonanza/ChrismasBigBassApiManager",
        machine: "../ReplayService/engine/machines/77_ChrismasBonanza/ChrismasBigBassSlotMachine",
    },
    vs20santawonder: {
        apiManager: "../ReplayService/engine/machines/78_SantaWonder/SantaWonderApiManager",
        machine: "../ReplayService/engine/machines/78_SantaWonder/SantaWonderSlotMachine",
    },
    vs20terrorv: {
        apiManager: "../ReplayService/engine/machines/79_CashElevator/CashElevatorApiManager",
        machine: "../ReplayService/engine/machines/79_CashElevator/CashElevatorSlotMachine",
    },
    vs10bblpop: {
        apiManager: "../ReplayService/engine/machines/80_BubblePop/BubblePopApiManager",
        machine: "../ReplayService/engine/machines/80_BubblePop/BubblePopSlotMachine",
    },
    vs25btygold: {
        apiManager: "../ReplayService/engine/machines/81_BountyGold/BountyGoldApiManager",
        machine: "../ReplayService/engine/machines/81_BountyGold/BountyGoldSlotMachine",
    },
    vs88hockattack: {
        apiManager: "../ReplayService/engine/machines/82_HockeyAttack/HockeyAttackApiManager",
        machine: "../ReplayService/engine/machines/82_HockeyAttack/HockeyAttackSlotMachine",
    },
    vswaysbbb: {
        apiManager: "../ReplayService/engine/machines/83_BigBassMega/BigBassMegaApiManager",
        machine: "../ReplayService/engine/machines/83_BigBassMega/BigBassMegaSlotMachine",
    },
    vs10bookfallen: {
        apiManager: "../ReplayService/engine/machines/84_BookOfFallen/BookOfFallenApiManager",
        machine: "../ReplayService/engine/machines/84_BookOfFallen/BookOfFallenSlotMachine",
    },
    vs40bigjuan: {
        apiManager: "../ReplayService/engine/machines/85_BigJuan/BigJuanApiManager.js",
        machine: "../ReplayService/engine/machines/85_BigJuan/BigJuanSlotMachine.js",
    },
    vs20bermuda: {
        apiManager: "../ReplayService/engine/machines/86_JohnBermuda/JohnBermudaApiManager",
        machine: "../ReplayService/engine/machines/86_JohnBermuda/JohnBermudaSlotMachine",
    },
    vs10starpirate: {
        apiManager: "../ReplayService/engine/machines/87_StarPiratesCode/StarPiratesCodeApiManager.js",
        machine: "../ReplayService/engine/machines/87_StarPiratesCode/StarPiratesCodeSlotMachine.js",
    },
    vswayswest: {
        apiManager: "../ReplayService/engine/machines/88_MysticChief/MysticChiefApiManager.js",
        machine: "../ReplayService/engine/machines/88_MysticChief/MysticChiefSlotMachine.js",
    },
    vs20daydead: {
        apiManager: "../ReplayService/engine/machines/89_DayOfDead/DayOfDeadApiManager",
        machine: "../ReplayService/engine/machines/89_DayOfDead/DayOfDeadSlotMachine",
    },
    vs20candvil: {
        apiManager: "../ReplayService/engine/machines/90_CandyVillage/CandyVillageApiManager",
        machine: "../ReplayService/engine/machines/90_CandyVillage/CandyVillageSlotMachine",
    },
    vs20wildboost: {
        apiManager: "../ReplayService/engine/machines/91_WildBooster/WildBoosterApiManager",
        machine: "../ReplayService/engine/machines/91_WildBooster/WildBoosterSlotMachine",
    },
    vswayshammthor: {
        apiManager: "../ReplayService/engine/machines/92_PowerOfThorMega/ThorMegaApiManager",
        machine: "../ReplayService/engine/machines/92_PowerOfThorMega/ThorMegaSlotMachine",
    },
    vs243lions: {
        apiManager: "../ReplayService/engine/machines/93_FiveLion/FiveLionApiManager",
        machine: "../ReplayService/engine/machines/93_FiveLion/FiveLionSlotMachine",
    },
    vs5super7: {
        apiManager: "../ReplayService/engine/machines/94_SuperSeven/SuperSevenApiManager",
        machine: "../ReplayService/engine/machines/94_SuperSeven/SuperSevenSlotMachine",
    },
    vs1masterjoker: {
        apiManager: "../ReplayService/engine/machines/95_MasterJoker/MasterJokerApiManager",
        machine: "../ReplayService/engine/machines/95_MasterJoker/MasterJokerSlotMachine",
    },
    vs20kraken: {
        apiManager: "../ReplayService/engine/machines/96_ReleaseKraken/ReleaseKrakenApiManager",
        machine: "../ReplayService/engine/machines/96_ReleaseKraken/ReleaseKrakenSlotMachine",
    },
    vs10firestrike: {
        apiManager: "../ReplayService/engine/machines/97_FireStrike/FireStrikeApiManager",
        machine: "../ReplayService/engine/machines/97_FireStrike/FireStrikeSlotMachine",
    },
    vs243fortune: {
        apiManager: "../ReplayService/engine/machines/98_CaishenGold/CaishenGoldApiManager",
        machine: "../ReplayService/engine/machines/98_CaishenGold/CaishenGoldSlotMachine",
    },
    vs4096mystery: {
        apiManager: "../ReplayService/engine/machines/99_Mysterious/MysteriousApiManager",
        machine: "../ReplayService/engine/machines/99_Mysterious/MysteriousSlotMachine",
    },
    vs20aladdinsorc: {
        apiManager: "../ReplayService/engine/machines/100_AladdinSorcer/AladdinSorcerApiManager",
        machine: "../ReplayService/engine/machines/100_AladdinSorcer/AladdinSorcerSlotMachine",
    },
    vs243fortseren: {
        apiManager: "../ReplayService/engine/machines/101_GreekGods/GreekGodsApiManager",
        machine: "../ReplayService/engine/machines/101_GreekGods/GreekGodsSlotMachine",
    },
    vs25chilli: {
        apiManager: "../ReplayService/engine/machines/102_ChillyHeat/ChillyHeatApiManager",
        machine: "../ReplayService/engine/machines/102_ChillyHeat/ChillyHeatSlotMachine",
    },
    vs8magicjourn: {
        apiManager: "../ReplayService/engine/machines/103_MagicJourney/MagicJourneyApiManager",
        machine: "../ReplayService/engine/machines/103_MagicJourney/MagicJourneySlotMachine",
    },
    vs25pantherqueen: {
        apiManager: "../ReplayService/engine/machines/104_PantherQueen/PantherQueenApiManager",
        machine: "../ReplayService/engine/machines/104_PantherQueen/PantherQueenSlotMachine",
    },
    // 105
    vs20leprexmas: {
        apiManager: "../ReplayService/engine/machines/106_LeprechaunCarol/LeprechaunCarolApiManager",
        machine: "../ReplayService/engine/machines/106_LeprechaunCarol/LeprechaunCarolSlotMachine",
    },
    // 107
    vs7pigs: {
        apiManager: "../ReplayService/engine/machines/108_SevenPigs/SevenPigsApiManager",
        machine: "../ReplayService/engine/machines/108_SevenPigs/SevenPigsSlotMachine",
    },
    vs243caishien: {
        apiManager: "../ReplayService/engine/machines/109_CaishenCash/CaishenCashApiManager",
        machine: "../ReplayService/engine/machines/109_CaishenCash/CaishenCashSlotMachine",
    }, //109
    vs5joker: {
        apiManager: "../ReplayService/engine/machines/110_JokerJewels/JokerJewelsApiManager",
        machine: "../ReplayService/engine/machines/110_JokerJewels/JokerJewelsSlotMachine",
    },
    vs25gladiator: {
        apiManager: "../ReplayService/engine/machines/111_WildGladiator/WildGladiatorApiManager",
        machine: "../ReplayService/engine/machines/111_WildGladiator/WildGladiatorSlotMachine",
    },
    vs25goldpig: {
        apiManager: "../ReplayService/engine/machines/112_GoldenPig/GoldenPigApiManager",
        machine: "../ReplayService/engine/machines/112_GoldenPig/GoldenPigSlotMachine",
    },
    vs25goldrush: {
        apiManager: "../ReplayService/engine/machines/113_Goldrush/GoldrushApiManager",
        machine: "../ReplayService/engine/machines/113_Goldrush/GoldrushSlotMachine",
    },
    vs25dragonkingdom: {
        apiManager: "../ReplayService/engine/machines/114_DragonKingdom/DragonKingdomApiManager",
        machine: "../ReplayService/engine/machines/114_DragonKingdom/DragonKingdomSlotMachine",
    },
    vs25kingdoms: {
        apiManager: "../ReplayService/engine/machines/115_ThreeKingdoms/ThreeKingdomsApiManager",
        machine: "../ReplayService/engine/machines/115_ThreeKingdoms/ThreeKingdomsSlotMachine",
    },
    vs1dragon8: {
        apiManager: "../ReplayService/engine/machines/116_Dragon888/Dragon888ApiManager",
        machine: "../ReplayService/engine/machines/116_Dragon888/Dragon888SlotMachine",
    }, // 116
    vs5aztecgems: {
        apiManager: "../ReplayService/engine/machines/117_AztecGems/AztecGemsApiManager",
        machine: "../ReplayService/engine/machines/117_AztecGems/AztecGemsSlotMachine",
    },
    vs20hercpeg: {
        apiManager: "../ReplayService/engine/machines/118_HerculesPegasus/HerculesPegasusApiManager",
        machine: "../ReplayService/engine/machines/118_HerculesPegasus/HerculesPegasusSlotMachine",
    },
    vs7fire88: {
        apiManager: "../ReplayService/engine/machines/119_Fire88/Fire88ApiManager",
        machine: "../ReplayService/engine/machines/119_Fire88/Fire88SlotMachine",
    },
    vs20honey: {
        apiManager: "../ReplayService/engine/machines/120_Honey/HoneyApiManager",
        machine: "../ReplayService/engine/machines/120_Honey/HoneySlotMachine",
    },
    // 121
    vs25safari: {
        apiManager: "../ReplayService/engine/machines/122_HotSafari/HotSafariApiManager",
        machine: "../ReplayService/engine/machines/122_HotSafari/HotSafariSlotMachine",
    },
    vs25journey: {
        apiManager: "../ReplayService/engine/machines/123_Seyugi/SeyugiApiManager",
        machine: "../ReplayService/engine/machines/123_Seyugi/SeyugiSlotMachine",
    },
    vs20chicken: {
        apiManager: "../ReplayService/engine/machines/124_TheGreatChicken/TheGreatChickenApiManager",
        machine: "../ReplayService/engine/machines/124_TheGreatChicken/TheGreatChickenSlotMachine",
    },
    vs1fortunetree: {
        apiManager: "../ReplayService/engine/machines/125_Fortunetree/FortunetreeApiManager",
        machine: "../ReplayService/engine/machines/125_Fortunetree/FortunetreeSlotMachine",
    },
    // 126
    // 127
    vs20wildpix: {
        apiManager: "../ReplayService/engine/machines/128_WildPixies/WildPixiesApiManager",
        machine: "../ReplayService/engine/machines/128_WildPixies/WildPixiesSlotMachine",
    },
    vs15fairytale: {
        apiManager: "../ReplayService/engine/machines/129_FairyTale/FairyTaleApiManager",
        machine: "../ReplayService/engine/machines/129_FairyTale/FairyTaleSlotMachine",
    },
    vs20santa: {
        apiManager: "../ReplayService/engine/machines/130_Santa/SantaApiManager",
        machine: "../ReplayService/engine/machines/130_Santa/SantaSlotMachine",
    },
    vs10vampwolf: {
        apiManager: "../ReplayService/engine/machines/131_VampireWolfes/VampireWolfesApiManager",
        machine: "../ReplayService/engine/machines/131_VampireWolfes/VampireWolfesSlotMachine",
    },
    vs50aladdin: {
        apiManager: "../ReplayService/engine/machines/132_3GenieWishes/3GenieWishesApiManager",
        machine: "../ReplayService/engine/machines/132_3GenieWishes/3GenieWishesSlotMachine",
    },
    // 133
    vs50hercules: {
        apiManager: "../ReplayService/engine/machines/134_Hercules/HerculesApiManager",
        machine: "../ReplayService/engine/machines/134_Hercules/HerculesSlotMachine",
    },
    vs7776aztec: {
        apiManager: "../ReplayService/engine/machines/135_AztecBonanza/AztecBonanzaApiManager",
        machine: "../ReplayService/engine/machines/135_AztecBonanza/AztecBonanzaSlotMachine",
    },
    vs5trdragons: {
        apiManager: "../ReplayService/engine/machines/136_TripleDragons/TripleDragonsApiManager",
        machine: "../ReplayService/engine/machines/136_TripleDragons/TripleDragonsSlotMachine",
    },
    vs40madwheel: {
        apiManager: "../ReplayService/engine/machines/137_WildMachine/WildMachineApiManager",
        machine: "../ReplayService/engine/machines/137_WildMachine/WildMachineSlotMachine",
    },
    vs25newyear: {
        apiManager: "../ReplayService/engine/machines/138_LuckyNewYear/LuckyNewYearApiManager",
        machine: "../ReplayService/engine/machines/138_LuckyNewYear/LuckyNewYearSlotMachine",
    },
    vs40frrainbow: {
        apiManager: "../ReplayService/engine/machines/139_FruitRainbow/FruitRainbowApiManager",
        machine: "../ReplayService/engine/machines/139_FruitRainbow/FruitRainbowSlotMachine",
    },
    vs50kingkong: {
        apiManager: "../ReplayService/engine/machines/140_MightyKong/MightyKongApiManager",
        machine: "../ReplayService/engine/machines/140_MightyKong/MightyKongSlotMachine",
    },
    // 141
    vs20godiva: {
        apiManager: "../ReplayService/engine/machines/142_LGodiba/LGodibaApiManager",
        machine: "../ReplayService/engine/machines/142_LGodiba/LGodibaSlotMachine",
    },
    vs9madmonkey: {
        apiManager: "../ReplayService/engine/machines/143_MadMonkey/MadMonkeyApiManager",
        machine: "../ReplayService/engine/machines/143_MadMonkey/MadMonkeySlotMachine",
    }, // 143
    vs1tigers: {
        apiManager: "../ReplayService/engine/machines/144_TripleTigers/TripleTigersApiManager",
        machine: "../ReplayService/engine/machines/144_TripleTigers/TripleTigersSlotMachine",
    }, // 144
    vs9chen: {
        apiManager: "../ReplayService/engine/machines/145_MasterChensFortune/MasterChensFortuneApiManager",
        machine: "../ReplayService/engine/machines/145_MasterChensFortune/MasterChensFortuneSlotMachine",
    },
    vs5hotburn: {
        apiManager: "../ReplayService/engine/machines/146_HotToBurn/HotToBurnApiManager",
        machine: "../ReplayService/engine/machines/146_HotToBurn/HotToBurnSlotMachine",
    },
    vs25dwarves_new: {
        apiManager: "../ReplayService/engine/machines/147_DwarvenGoldDeluxe/DwarvenGoldDeluxeApiManager",
        machine: "../ReplayService/engine/machines/147_DwarvenGoldDeluxe/DwarvenGoldDeluxeSlotMachine",
    },
    // 148
    // 149
    // 150
    // 151
    vs20leprechaun: {
        apiManager: "../ReplayService/engine/machines/152_LeprechaunSong/LeprechaunSongApiManager",
        machine: "../ReplayService/engine/machines/152_LeprechaunSong/LeprechaunSongSlotMachine",
    },
    vs7monkeys: {
        apiManager: "../ReplayService/engine/machines/153_SevenMonkeys/SevenMonkeysApiManager",
        machine: "../ReplayService/engine/machines/153_SevenMonkeys/SevenMonkeysSlotMachine",
    },
    // 154
    vs18mashang: {
        apiManager: "../ReplayService/engine/machines/155_TreasureHorse/TreasureHorseApiManager",
        machine: "../ReplayService/engine/machines/155_TreasureHorse/TreasureHorseSlotMachine",
    },
    vs5spjoker: {
        apiManager: "../ReplayService/engine/machines/156_SuperJoker/SuperJokerApiManager",
        machine: "../ReplayService/engine/machines/156_SuperJoker/SuperJokerSlotMachine",
    },
    vs20egypttrs: {
        apiManager: "../ReplayService/engine/machines/157_EgyptFortune/EgyptFortuneApiManager",
        machine: "../ReplayService/engine/machines/157_EgyptFortune/EgyptFortuneSlotMachine",
    },
    // 158
    // 159
    vs9hotroll: {
        apiManager: "../ReplayService/engine/machines/160_HotRoll/HotRollApiManager",
        machine: "../ReplayService/engine/machines/160_HotRoll/HotRollSlotMachine",
    }, // 160
    vs4096jurassic: {
        apiManager: "../ReplayService/engine/machines/161_JurassicGiants/JurassicGiantsApiManager",
        machine: "../ReplayService/engine/machines/161_JurassicGiants/JurassicGiantsSlotMachine",
    },
    vs3train: {
        apiManager: "../ReplayService/engine/machines/162_GoldTrain/GoldTrainApiManager",
        machine: "../ReplayService/engine/machines/162_GoldTrain/GoldTrainSlotMachine",
    },
    vs40beowulf: {
        apiManager: "../ReplayService/engine/machines/163_Beowulf/BeowulfApiManager",
        machine: "../ReplayService/engine/machines/163_Beowulf/BeowulfSlotMachine",
    },
    vs1024atlantis: {
        apiManager: "../ReplayService/engine/machines/164_QueenofAtlantis/QueenofAtlantisApiManager",
        machine: "../ReplayService/engine/machines/164_QueenofAtlantis/QueenofAtlantisSlotMachine",
    },
    // 165
    // 166
    // 167
    // 168
    // 169
    // 170
    // 171
    vs243crystalcave: {
        apiManager: "../ReplayService/engine/machines/172_MagicCrystal/MagicCrystalApiManager",
        machine: "../ReplayService/engine/machines/172_MagicCrystal/MagicCrystalSlotMachine",
    },
    // 173
    // 174
    vs5trjokers: {
        apiManager: "../ReplayService/engine/machines/175_TripleJokers/TripleJokersApiManager",
        machine: "../ReplayService/engine/machines/175_TripleJokers/TripleJokersSlotMachine",
    },
    // 176
    // 177
    vs1money: {
        apiManager: "../ReplayService/engine/machines/178_Money/MoneyApiManager",
        machine: "../ReplayService/engine/machines/178_Money/MoneySlotMachine",
    },
    vs75bronco: {
        apiManager: "../ReplayService/engine/machines/179_BroncoSpirit/BroncoSpiritApiManager",
        machine: "../ReplayService/engine/machines/179_BroncoSpirit/BroncoSpiritSlotMachine",
    },
    vs1600drago: {
        apiManager: "../ReplayService/engine/machines/180_DragoJewels/DragoJewelsApiManager",
        machine: "../ReplayService/engine/machines/180_DragoJewels/DragoJewelsSlotMachine",
    },
    vs1fufufu: {
        apiManager: "../ReplayService/engine/machines/181_FuFuFu/FuFuFuApiManager",
        machine: "../ReplayService/engine/machines/181_FuFuFu/FuFuFuSlotMachine",
    }, // 181
    vs40streetracer: {
        apiManager: "../ReplayService/engine/machines/182_StreetRacer/StreetRacerApiManager",
        machine: "../ReplayService/engine/machines/182_StreetRacer/StreetRacerSlotMachine",
    },
    vs9aztecgemsdx: {
        apiManager: "../ReplayService/engine/machines/183_AztecGemsDeluxe/AztecGemsDeluxeApiManager",
        machine: "../ReplayService/engine/machines/183_AztecGemsDeluxe/AztecGemsDeluxeSlotMachine",
    },
    vs20gorilla: {
        apiManager: "../ReplayService/engine/machines/184_JungleGorilla/JungleGorillaApiManager",
        machine: "../ReplayService/engine/machines/184_JungleGorilla/JungleGorillaSlotMachine",
    },
    vswayswerewolf: {
        apiManager: "../ReplayService/engine/machines/185_WerewolfMegaways/WerewolfMegawaysApiManager",
        machine: "../ReplayService/engine/machines/185_WerewolfMegaways/WerewolfMegawaysSlotMachine",
    },
    vswayshive: {
        apiManager: "../ReplayService/engine/machines/186_StarBounty/StarBountyApiManager",
        machine: "../ReplayService/engine/machines/186_StarBounty/StarBountySlotMachine",
    },
    vs25samurai: {
        apiManager: "../ReplayService/engine/machines/187_RiseofSamurai/RiseofSamuraiApiManager",
        machine: "../ReplayService/engine/machines/187_RiseofSamurai/RiseofSamuraiSlotMachine",
    },
    vs25walker: {
        apiManager: "../ReplayService/engine/machines/188_WildWalker/WildWalkerApiManager",
        machine: "../ReplayService/engine/machines/188_WildWalker/WildWalkerSlotMachine",
    },
    vs20goldfever: {
        apiManager: "../ReplayService/engine/machines/189_GoldFever/GoldFeverApiManager",
        machine: "../ReplayService/engine/machines/189_GoldFever/GoldFeverSlotMachine",
    },
    vs25bkofkngdm: {
        apiManager: "../ReplayService/engine/machines/190_BookOfKingdom/BookOfKingdomApiManager",
        machine: "../ReplayService/engine/machines/190_BookOfKingdom/BookOfKingdomSlotMachine",
    },
    // 191
    vs10goldfish: {
        apiManager: "../ReplayService/engine/machines/192_FishInReels/FishInReelsApiManager",
        machine: "../ReplayService/engine/machines/192_FishInReels/FishInReelsSlotMachine",
    },
    // 193
    vs1024dtiger: {
        apiManager: "../ReplayService/engine/machines/194_DragonTiger/DragonTigerApiManager",
        machine: "../ReplayService/engine/machines/194_DragonTiger/DragonTigerSlotMachine",
    },
    // 195
    vs20eking: {
        apiManager: "../ReplayService/engine/machines/196_EmeraldKing/EmeraldKingApiManager",
        machine: "../ReplayService/engine/machines/196_EmeraldKing/EmeraldKingSlotMachine",
    },
    vs20xmascarol: {
        apiManager: "../ReplayService/engine/machines/197_ChristmasCarolMega/ChristmasCarolMegaApiManager",
        machine: "../ReplayService/engine/machines/197_ChristmasCarolMega/ChristmasCarolMegaSlotMachine",
    },
    vs10mayangods: {
        apiManager: "../ReplayService/engine/machines/198_JohnHunterAndMayanGods/JohnMayanGodApiManager",
        machine: "../ReplayService/engine/machines/198_JohnHunterAndMayanGods/JohnMayanGodSlotMachine",
    },
    vs20bonzgold: {
        apiManager: "../ReplayService/engine/machines/199_BonanzaGold/BonanzaGoldApiManager",
        machine: "../ReplayService/engine/machines/199_BonanzaGold/BonanzaGoldSlotMachine",
    },
    // 200
    vs25gldox: {
        apiManager: "../ReplayService/engine/machines/201_GoldenOx/GoldenOxApiManager",
        machine: "../ReplayService/engine/machines/201_GoldenOx/GoldenOxSlotMachine",
    },
    vs10wildtut: {
        apiManager: "../ReplayService/engine/machines/202_MysteriousEgypt/MysteriousEgyptApiManager",
        machine: "../ReplayService/engine/machines/202_MysteriousEgypt/MysteriousEgyptSlotMachine",
    },
    vs20ekingrr: {
        apiManager: "../ReplayService/engine/machines/203_EmeraldKingRainbow/EmeraldKingRainbowApiManager",
        machine: "../ReplayService/engine/machines/203_EmeraldKingRainbow/EmeraldKingRainbowSlotMachine",
    },
    vs10eyestorm: {
        apiManager: "../ReplayService/engine/machines/204_EyeOfStorm/EyeOfStormApiManager",
        machine: "../ReplayService/engine/machines/204_EyeOfStorm/EyeOfStormSlotMachine",
    },
    // 205
    // 206
    // 207
    // 208
    // 209
    // 210
    vs117649starz: {
        apiManager: "../ReplayService/engine/machines/211_StarsMegaways/StarsMegaApiManager",
        machine: "../ReplayService/engine/machines/211_StarsMegaways/StarsMegaSlotMachine",
    },
    vs10amm: {
        apiManager: "../ReplayService/engine/machines/212_AmazingMachine/AmazingMachineApiManager",
        machine: "../ReplayService/engine/machines/212_AmazingMachine/AmazingMachineSlotMachine",
    },
    // 213
    vswaysyumyum: {
        apiManager: "../ReplayService/engine/machines/214_YumYumPowerways/YumYumPowewaysApiManager",
        machine: "../ReplayService/engine/machines/214_YumYumPowerways/YumYumPowewaysSlotMachine",
    },
    // 215
    vswayschilheat: {
        apiManager: "../ReplayService/engine/machines/216_ChilliHeatMegaways/ChilliHeatMegaApiManager",
        machine: "../ReplayService/engine/machines/216_ChilliHeatMegaways/ChilliHeatMegaSlotMachine",
    },
    vs10luckcharm: {
        apiManager: "../ReplayService/engine/machines/217_LuckyGraceAndCharm/LuckyGraceAndCharmApiManager",
        machine: "../ReplayService/engine/machines/217_LuckyGraceAndCharm/LuckyGraceAndCharmSlotMachine",
    },
    vswaysaztecking: {
        apiManager: "../ReplayService/engine/machines/218_AztecKingMega/AztecKingMegaApiManager",
        machine: "../ReplayService/engine/machines/218_AztecKingMega/AztecKingMegaSlotMachine",
    },
    vs20phoenixf: {
        apiManager: "../ReplayService/engine/machines/219_Phoenix/PhonixApiManager",
        machine: "../ReplayService/engine/machines/219_Phoenix/PhonixSlotMachine",
    },
    vs576hokkwolf: {
        apiManager: "../ReplayService/engine/machines/220_HokkWolf/HokkWolfApiManager",
        machine: "../ReplayService/engine/machines/220_HokkWolf/HokkWolfSlotMachine",
    },
    vs20trsbox: {
        apiManager: "../ReplayService/engine/machines/221_TreasureWild/TreasureWildApiManager",
        machine: "../ReplayService/engine/machines/221_TreasureWild/TreasureWildSlotMachine",
    },
    vs243chargebull: {
        apiManager: "../ReplayService/engine/machines/222_RagingBull/RagingBullApiManager",
        machine: "../ReplayService/engine/machines/222_RagingBull/RagingBullSlotMachine",
    },
    // 223
    vs20pbonanza: {
        apiManager: "../ReplayService/engine/machines/224_Pbonanza/PyramidBonanzaApiManager",
        machine: "../ReplayService/engine/machines/224_Pbonanza/PyramidBonanzaMachine",
    },
    vs243empcaishen: {
        apiManager: "../ReplayService/engine/machines/225_EmpCaishen/EmpCaishenApiManager",
        machine: "../ReplayService/engine/machines/225_EmpCaishen/EmpCaishenSlotMachine",
    }, // 225
    vs25tigeryear: {
        apiManager: "../ReplayService/engine/machines/226_LuckyNewYear/LuckNewYearApiManager",
        machine: "../ReplayService/engine/machines/226_LuckyNewYear/LuckNewYearSlotMachine",
    },
    vs20amuleteg: {
        apiManager: "../ReplayService/engine/machines/227_FortuneofGiza/FortuneofGizaApiManager",
        machine: "../ReplayService/engine/machines/227_FortuneofGiza/FortuneofGizaSlotMachine",
    },
    vs10runes: {
        apiManager: "../ReplayService/engine/machines/228_GatesOfValhalla/GatesOfValhallaApiManager",
        machine: "../ReplayService/engine/machines/228_GatesOfValhalla/GatesOfValhallaSlotMachine",
    },
    vs25goldparty: {
        apiManager: "../ReplayService/engine/machines/229_GoldParty/GoldPartyApiManager",
        machine: "../ReplayService/engine/machines/229_GoldParty/GoldPartySlotMachine",
    },
    vswaysxjuicy: {
        apiManager: "../ReplayService/engine/machines/230_ExtraJuicyMega/ExtraJuicyMegaApiManager",
        machine: "../ReplayService/engine/machines/230_ExtraJuicyMega/ExtraJuicyMegaSlotMachine",
    },
    vs40wanderw: {
        apiManager: "../ReplayService/engine/machines/231_WildDepth/WildDepthApiManager",
        machine: "../ReplayService/engine/machines/231_WildDepth/WildDepthSlotMachine",
    },
    vs4096magician: {
        apiManager: "../ReplayService/engine/machines/232_MagificanSecret/MagificanSecretApiManager",
        machine: "../ReplayService/engine/machines/232_MagificanSecret/MagificanSecretSlotMachine",
    },
    vs20smugcove: {
        apiManager: "../ReplayService/engine/machines/233_SmugglersCove/SmugglersCoveApiManager",
        machine: "../ReplayService/engine/machines/233_SmugglersCove/SmugglersCoveSlotMachine",
    },
    vswayscryscav: {
        apiManager: "../ReplayService/engine/machines/234_CrystalCavensMega/CrystalCavensMegaApiManager",
        machine: "../ReplayService/engine/machines/234_CrystalCavensMega/CrystalCavensMegaSlotMachine",
    },
    // 235
    vs5aztecgems_jp: {
        apiManager: "../ReplayService/engine/machines/236_Aztec/AztecApiManager",
        machine: "../ReplayService/engine/machines/236_Aztec/AztecSlotMachine",
    }, // 236
    vswayslofhero: {
        apiManager: "../ReplayService/engine/machines/295_LegendOfHereos/LegendOfHeroesApiManager",
        machine: "../ReplayService/engine/machines/295_LegendOfHereos/LegendOfHeroesSlotMachine",
    }, // 295
};

module.exports = (app) => {
    const { Sequelize } = app.db;
    const Player = app.db.sequelize.define(
        "player",
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            token: { type: Sequelize.STRING },
            agentCode: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
            userCode: { type: Sequelize.STRING },
            gameCode: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
            txnID: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
            connected: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0 },
            gameMode: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }, // 0:                    , 1:                ,                                       PRAGMATIC_OLD                                                  .                                    .
            patRequested: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }, // 1:                    (       8942)
            curIndex: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
            lastJackpotIndex: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            nextJackpot: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 100 },
            totalDebit: { type: Sequelize.DOUBLE(50, 2), allowNull: false, defaultValue: 0 },
            totalCredit: { type: Sequelize.DOUBLE(50, 2), allowNull: false, defaultValue: 0 },
            realRtp: { type: Sequelize.DOUBLE(10, 2), allowNull: false, defaultValue: 0 },
            callHistId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
            settings: { type: Sequelize.TEXT("long") },
            totalBet: { type: Sequelize.DOUBLE(20, 2), allowNull: false, defaultValue: 0 },
            virtualBet: { type: Sequelize.DOUBLE(20, 2), allowNull: false, defaultValue: 0 },
            callStatus: Sequelize.STRING,
            //           5                                                      .
            jackpotCome: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 90 }, // 2022-12-09 18:00 Julian                       .
            baseWinCome: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
            highBaseCome: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
            jackpotLimit: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 90 },
            highBaseLimit: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 50 },
            machine: {
                type: Sequelize.TEXT("long"),
                get() {
                    let val = this.getDataValue("machine");
                    if (typeof val == "object") {
                        return val;
                    } else {
                        return JSON.parse(val ? val : "{}");
                    }
                },
            },
            lastPattern: {
                type: Sequelize.TEXT("long"),
                get() {
                    let val = this.getDataValue("lastPattern");
                    if (typeof val == "object") {
                        return val;
                    } else {
                        return JSON.parse(val ? val : "{}");
                    }
                },
                // set(val) {
                //     this.setDataValue('lastPattern', JSON.stringify(val));
                // }
            },
            betPerLine: { type: Sequelize.DOUBLE(10, 2), allowNull: false, defaultValue: 0 },
            viewStack: {
                //
                type: Sequelize.TEXT("long"),
                get() {
                    let val = this.getDataValue("viewStack");
                    if (typeof val == "object") {
                        return val;
                    } else {
                        return JSON.parse(val ? val : "[]");
                    }
                },
            },
            fsStack: {
                //
                type: Sequelize.TEXT("long"),
                get() {
                    let val = this.getDataValue("fsStack");
                    if (typeof val == "object") {
                        return val;
                    } else {
                        return JSON.parse(val ? val : "[]");
                    }
                },
            },
            viewHistory: {
                type: Sequelize.TEXT("long"),
                get() {
                    let val = this.getDataValue("viewHistory");
                    if (typeof val == "object") {
                        return val;
                    } else {
                        return JSON.parse(val ? val : "[]");
                    }
                },
            },
            replayLogList: {
                type: Sequelize.TEXT("long"),
                get() {
                    let val = this.getDataValue("replayLogList");
                    if (typeof val == "object") {
                        return val;
                    } else {
                        return JSON.parse(val ? val : "[]");
                    }
                },
            },
            callPattern: {
                type: Sequelize.TEXT("long"),
                get() {
                    let val = this.getDataValue("callPattern");
                    if (typeof val == "object") {
                        return val;
                    } else {
                        return JSON.parse(val ? val : "{}");
                    }
                },
            },
            purchaseCallPattern: {
                type: Sequelize.TEXT("long"),
                get() {
                    let val = this.getDataValue("purchaseCallPattern");
                    if (typeof val == "object") {
                        return val;
                    } else {
                        return JSON.parse(val ? val : "{}");
                    }
                },
            },
        },
        {
            timestamps: true,
            indexes: [
                {
                    name: "token",
                    unique: true,
                    method: "BTREE",
                    fields: ["token"],
                },
            ],
        }
    );

    Player.prototype.setBalance = function (debit, credit) {
        //                                                      .
        if (this.callHistId <= 0) {
              console.log(debit,credit)
            this.totalDebit += debit;
            this.totalCredit += credit;
            this.realRtp = this.totalDebit ? ((this.totalCredit / this.totalDebit) * 100).toFixed(2) : 100;
        }
        //
    };

    Player.prototype.Init = async function (user, param, isGen = 0) {
        this.balance = user.balance;
        this.prevTotalBet = this.virtualBet;
        this.lastPattern = this.lastPattern || {};
        this.viewStack = this.viewStack || [];
        this.fsStack = this.fsStack || [];
        this.viewHistory = this.viewHistory || [];
        this.replayLogList = this.replayLogList || [];
        this.callPattern = this.callPattern || {};
        this.purchaseCallPattern = this.purchaseCallPattern || {};
        this.currentApi = this.currentApi || {};
        
        // Генерация токена при создании
       

        let ApiManager = require(GameServers[this.gameCode].apiManager);
        this.apiManager = new ApiManager();

        let SlotMachine = require(GameServers[this.gameCode].machine);

        if (this.machine) {
            let instance = new SlotMachine();
            Object.assign(instance, this.machine);
            this.machine = instance;
        } else {
            this.machine = new SlotMachine();
        }

        if (param.c && this.machine.lineCount) {
            this.betPerLine = Number(param.c);
            this.totalBet = this.betPerLine * this.machine.lineCount;
            this.virtualBet = this.betPerLine * this.machine.lineCount;
        }

        this.betIncreased = this.prevTotalBet < this.virtualBet;
        this.machine.prevBalance = this.balance;

        if (!isGen) {
            if (this.viewStack.length == 0 || this.betIncreased) {
                await CheckPatternEnough(this, user, param);
            } else {
                CheckPatternEnough(this, user, param);
            }
        } else {
            this.viewStack = [];
        }
    };

    /**
     * @author JackSon
     * msg -
     * type - 1:                       , 0:
     */
    Player.prototype.logHist = function (msg, type = 0) {
        if (!global.logConfig.show_log) {
            return;
        }
        if (global.logConfig.filter) {
            if (global.logConfig.filter_user != "" && this.userCode.indexOf(global.logConfig.filter_user) < 0) {
                return;
            }
            if (global.logConfig.filter_game != "" && this.gameCode.indexOf(global.logConfig.filter_game) < 0) {
                return;
            }
        }
        if (type == 1) {
            if (this.gameMode == 1) {
                logger.info(`${msg},                : ${this.viewStack.length}`);
            } else {
                logger.info(`${msg}`);
            }
        } else {
            logger.info(`(${this.userCode}, ${this.gameCode}) ${msg}`);
        }
    };

    Player.prototype.SetTotalBet = function (param) {
        const initPattern = this.apiManager.InitApi({}, param);

        if (
            this.machine.currentGame == "FREE" ||
            this.machine.currentGame == "FREESPINCOUNT" ||
            (this.machine.currentGame == "BONUS" && this.gameCode != "vs15fairytale") ||
            this.machine.bonusGameEnd == false ||
            this.machine.tumbleStatus == "TUMBLE" ||
            this.machine.nudgeStatus == "NUDGE" ||
            this.machine.wildRespin == true ||
            this.machine.respinStatus == "RESPIN"
        ) {
            this.totalBet = 0;
        }

        if (this.totalBet > 0) {
            if (param.pur) {
                this.totalBet = this.betPerLine * JSON5.parse(initPattern.purInit)[Number(param.pur)].bet;
            } else if (param.fsp) {
                this.totalBet = this.betPerLine * Number(initPattern.fspps.split("~")[0]);
            } else if (param.bl) {
                this.totalBet = this.betPerLine * Number(initPattern.bls.split(",")[Number(param.bl)]);
            }
        }

        return this.totalBet;
    };

    Player.prototype.HandleInit = function (param) {
        this.currentApi = this.apiManager.InitApi(this, param);
        this.lastPattern = this.currentApi;
    };

    Player.prototype.HandleSpin = async function (param, user) {
        const prevGameMode = this.machine.currentGame;

        if (this.totalBet > 0) {
            this.txnID = new MD5()
                .update(
                    this.agentCode + this.userCode + this.gameCode + Math.floor(Math.random() * 1000000) + Date.now()
                )
                .digest("hex");

            if (param.pur || param.fsp) {
                if (this.purchaseCallPattern.totalBet && this.purchaseCallPattern.totalBet != this.virtualBet) {
                    const call = await app.db.Call.findOne({
                        where: {
                            agentCode: this.agentCode,
                            userCode: this.userCode,
                            gameCode: this.gameCode,
                            type: 2,
                            callStatus: "CALL_WAITING",
                        },
                    });
                    this.call = { id: call.id, type: 2, status: 2 };
                    await call.update({ summedMoney: 0, callStatus: "CALL_FAIL" });
                    this.purchaseCallPattern = {};
                    this.callHistId = -1;
                    this.callStatus = "NOCALL";
                }
                if (Object.keys(this.purchaseCallPattern).length) {
                    const call = await app.db.Call.findOne({
                        where: {
                            agentCode: this.agentCode,
                            userCode: this.userCode,
                            gameCode: this.gameCode,
                            type: 2,
                            callStatus: "CALL_WAITING",
                        },
                    });
                    this.call = { id: call.id, type: 2, status: 1 };
                    this.viewCache = this.purchaseCallPattern;
                    this.purchaseCallPattern = {};
                    this.callHistId = call.id;
                    this.callStatus = "CALL_START";
                } else {
                    let missedMoney = (this.totalDebit * user.targetRtp) / 100 - this.totalCredit;
                    logger.info(
                        `[               ] (${this.userCode}, ${this.gameCode})       : ${Math.floor(missedMoney)}`
                    );
                    if (missedMoney <= 0) {
                        logger.info(
                            `[                                      ] (${this.userCode}, ${this.gameCode})           ${rtpConfig.BuyBonusDefaultMulti}                    `
                        );
                        missedMoney = this.virtualBet * rtpConfig.BuyBonusDefaultMulti;
                    } else if (missedMoney > this.virtualBet * rtpConfig.BuyBonusDefaultMulti * 3) {
                        logger.info(
                            `[                                      ] (${this.userCode}, ${
                                this.gameCode
                            })                          * 3 = ${rtpConfig.BuyBonusDefaultMulti * 3}                    `
                        );
                        missedMoney = this.virtualBet * rtpConfig.BuyBonusDefaultMulti * 3;
                    }
                    this.viewCache = this.loadNextBuyPattern(missedMoney);
                    this.callHistId = -1;
                    this.callStatus = "NOCALL";
                }
            } else {
                if (this.callPattern.totalBet && this.callPattern.totalBet != this.virtualBet) {
                    const call = await app.db.Call.findOne({ where: { id: this.callHistId } });
                    this.call = { id: call.id, type: 1, status: 2 };
                    await call.update({ summedMoney: 0, callStatus: "CALL_FAIL" });
                    this.callPattern = {};
                    this.callHistId = -1;
                    this.callStatus = "NOCALL";
                }
                if (Object.keys(this.callPattern).length && this.callHistId > 0) {
                    this.viewCache = this.callPattern;
                    const call = await app.db.Call.findOne({ where: { id: this.callHistId } });
                    if (call) {
                        this.call = { id: call.id, type: 1, status: 1 };
                        this.callStatus = "CALL_START";
                        this.callPattern = {};
                    } else {
                        logger.info(
                            `                                              >>>>>>>>>> ${this.agentCode}, ${this.userCode}, ${this.gameCode}`
                        );
                        this.callHistId = -1;
                        this.callPattern = {};
                    }
                } else {
                    this.viewCache = this.loadNextPattern(user);
                    this.callStatus = "NOCALL";
                }
            }

            while (!this.viewCache) {
                //
                this.logHist(
                    `[                ] length == 0, HandleSpin                ,                                                            .`
                );
                await CheckPatternEnough(this, user, param);
                this.viewCache = this.loadNextPattern(user);
            }
            if (this.viewCache.win != 0) {
                let aa = 0;
            }
            this.viewHistory.push({
                balance: this.balance - this.totalBet + this.viewCache.win, // TODO
                win: this.viewCache.win,
                type: this.viewCache.type,
                isCall: this.viewCache.isCall,
            });
            this.viewHistory.length > 300 ? this.viewHistory.shift() : 0;
        }

        this.balance -= this.totalBet;
        this.machine.SpinFromPattern(this, param);

        this.currentApi = this.apiManager.GameApi(this, prevGameMode, param);
        this.lastPattern = this.currentApi;
    };

    Player.prototype.HandleFSOption = function (param) {
        this.machine.FreeSpinOption(this, param.ind);

        this.currentApi = this.apiManager.FreeSpinOptionApi(this, param);
        this.fsoPattern = this.currentApi;
    };

    Player.prototype.HandleGambleOption = function (param) {
        this.machine.GamblingOption(this, param);

        this.currentApi = this.apiManager.GamblingOptionApi(this, param);
        Object.assign(this.lastPattern, this.currentApi);
    };

    Player.prototype.HandleGamble = function (param) {
        this.machine.Gambling(this, param);

        this.currentApi = this.apiManager.GamblingApi(this, param);
        Object.assign(this.lastPattern, this.currentApi);
    };

    Player.prototype.HandleCollect = function (param) {
        if (param.index != "2") {
            if (this.machine.gameSort == "FREE" && this.machine.currentGame == "BASE") {
                this.balance = Number(this.balance) + Number(this.machine.freeSpinWinMoney);
                this.lastJackpotIndex = this.curIndex;
            } else if (this.machine.gameSort == "BONUS" && this.machine.currentGame == "BASE") {
                this.balance = Number(this.balance) + Number(this.machine.moneyBonusWin);
                this.lastJackpotIndex = this.curIndex;
            } else {
                if (this.machine.tumbleStatus) {
                    this.balance = Number(this.balance) + Number(this.machine.tmb_res);
                } else if (this.machine.nudgeStatus) {
                    this.balance = Number(this.balance) + Number(this.machine.nudge_res);
                } else if (this.machine.respinStatus) {
                    this.balance = Number(this.balance) + Number(this.machine.respinWinMoney);
                } else {
                    this.balance = Number(this.balance) + Number(this.machine.winMoney);
                }
            }
        }

        this.currentApi = this.apiManager.CollectApi(this, param);
        Object.assign(this.lastPattern, this.currentApi);
    };

    Player.prototype.HandleBonus = function (param) {
        this.totalBet = 0;
        this.machine.totalBet = 0;
        this.machine.BonusSpin(this, param);

        this.currentApi = this.apiManager.BonusApi(this, param);
        Object.assign(this.lastPattern, this.currentApi);
    };

    Player.prototype.HandleCollectBonus = function (param) {
        this.totalBet = 0;
        this.machine.totalBet = 0;

        if (param.index != "2") {
            this.balance += this.machine.moneyBonusWin;
        }

        this.currentApi = this.apiManager.CollectBonusApi(this, param);
        Object.assign(this.lastPattern, this.currentApi);
    };

    Player.prototype.HandleMystery = function (param) {
        this.currentApi = this.apiManager.MysteryApi(this, param);
        Object.assign(this.lastPattern, this.currentApi);
    };

    Player.prototype.loadNextPattern = function (user) {
        // player.gameMode    0                                                  1
        if (this.gameMode == 0) {
            return this.nextPattern(user);
        }
        return this.viewStack.shift();
    };

    Player.prototype.loadNextBuyPattern = function (maxLimit) {
        // player.gameMode    0                                                  1
        if (this.gameMode == 0) {
            return this.findBuyBonus(Util.random(maxLimit * 0.1, maxLimit * (Util.probability(70) ? 0.7 : 1)));
        }
        return this.fsStack.shift();
    };

    Player.prototype.nextPattern = function (user) {
        let pattern = null;
        //1.              (          *          )
        if (this.realRtp > user.targetRtp) {
            // pattern = this.getPatternByCome("      ", user, this.nextJackpot, 51, 20);
            pattern = this.getPatternByCome(
                "      ",
                user,
                this.nextJackpot,
                Math.floor(this.highBaseCome * this.baseWinCome),
                Math.floor((this.highBaseCome * this.baseWinCome) / 2.5)
            );
        } else {
            //3.              (          *          )
            if (this.realRtp > user.targetRtp / 2) {
                // pattern = this.getPatternByCome("             ", user, this.nextJackpot, 19, 11);
                pattern = this.getPatternByCome(
                    "             ",
                    user,
                    this.nextJackpot,
                    Math.floor((this.highBaseCome * this.baseWinCome) / 2),
                    Math.floor(this.highBaseCome + this.baseWinCome)
                );
            } else {
                // pattern = this.getPatternByCome("      ", user, this.nextJackpot, 4, 3);
                pattern = this.getPatternByCome(
                    "      ",
                    user,
                    this.nextJackpot,
                    Math.floor(this.baseWinCome / 2 + 1),
                    Math.floor(this.baseWinCome / 3 + 1)
                );
            }
        }

        if (!pattern) {
            pattern = this.machine.SpinForBaseGen(this.betPerLine, this.virtualBet, 0);
        }

        return pattern;
    };

    Player.prototype.getPatternByCome = function (reason, user, freeCome, bigCome, smallCome) {
        let missedMoney = (this.totalDebit * user.targetRtp) / 100 - this.totalCredit; //
        const realBigCome = bigCome + Util.random(0, bigCome);
        const realSmallCome = smallCome + Util.random(0, smallCome);
        const realFreeCome = freeCome; //nextJackpot
        let pattern = null;
        let deltaIndex = this.curIndex - this.lastJackpotIndex;

        if (this.virtualBet == 0) {
            logger.info(
                `[VirtualBet       ] (${this.userCode}, ${this.gameCode}) this.virtualBet = 0, Zero                       `
            );
            return this.machine.SpinForBaseGen(this.betPerLine, this.virtualBet, 0);
        }

        if (deltaIndex != 0 && deltaIndex % realFreeCome == 0) {
            //1.
            // this.logHist(`${this.gameMode == 1 ? "[                  ]" : ""} ${reason} FREE`);
            let freeMaxMoney = this.virtualBet * this.jackpotLimit;
            let freeMinMoney = this.virtualBet * rtpConfig.FreeMinMulti;

            //                      (             5   )
            if (missedMoney < this.virtualBet * 10) {
                return this.machine.SpinForBaseGen(this.betPerLine, this.virtualBet, 0);
            }

            //
            if (missedMoney < freeMaxMoney) {
                freeMaxMoney = missedMoney;
            }

            pattern = this.findFreeByRtp(freeMinMoney, freeMaxMoney);

            if (pattern) {
                this.nextJackpot = Util.random(rtpConfig.JackpotNormalStart, rtpConfig.JackpotNormalEnd);
                if (Util.probability(rtpConfig.JackpotLongPercent)) {
                    this.nextJackpot = Util.random(rtpConfig.JackpotLongStart, rtpConfig.JackpotLongEnd);
                }
                this.lastJackpotIndex = this.curIndex;
                this.logInfo = {
                    type: "      ",
                    range: `${freeMinMoney} ~ ${freeMaxMoney}   `,
                };
            }
        } else if (deltaIndex != 0 && deltaIndex % realBigCome == 0) {
            //2.
            let bigBaseMaxMoney = this.virtualBet * this.highBaseLimit;
            let bigBaseMinMoney = this.virtualBet * rtpConfig.SmallBaseMaxMulti;

            //
            if (missedMoney < bigBaseMinMoney) {
                if (Util.probability(50)) {
                    missedMoney = this.virtualBet * 2; //
                    bigBaseMinMoney = this.virtualBet;
                } else {
                    return this.machine.SpinForBaseGen(this.betPerLine, this.virtualBet, 0);
                }
            }

            //
            if (missedMoney < bigBaseMaxMoney) {
                bigBaseMaxMoney = missedMoney;
            }

            this.logInfo = {
                type: "            ",
                range: `${bigBaseMinMoney} ~ ${bigBaseMaxMoney}   `,
            };
            pattern = this.findBaseByRtp(bigBaseMinMoney, bigBaseMaxMoney);
        } else if (deltaIndex != 0 && deltaIndex % realSmallCome == 0) {
            //3.
            let smallBaseMaxMoney = this.virtualBet * rtpConfig.SmallBaseMaxMulti;
            let smallBaseMinMoney = 0;

            //
            if (missedMoney < smallBaseMinMoney) {
                if (Util.probability(50)) {
                    missedMoney = this.virtualBet; //
                } else {
                    return this.machine.SpinForBaseGen(this.betPerLine, this.virtualBet, 0);
                }
            }

            //
            if (missedMoney < smallBaseMaxMoney) {
                smallBaseMaxMoney = missedMoney;
            }

            this.logInfo = {
                type: "               ",
                range: `${smallBaseMinMoney} ~ ${smallBaseMaxMoney}   `,
            };
            pattern = this.findBaseByRtp(0, smallBaseMaxMoney);
        }

        return pattern;
    };

    Player.prototype.findBaseByRtp = function (minMoney, maxMoney) {
        let pattern = {},
            calcCount = 0,
            bottomLimit = minMoney,
            defWin = Util.random(minMoney, maxMoney);
        while (true) {
            pattern = this.machine.SpinForBaseGen(this.betPerLine, this.virtualBet, defWin);
            if (pattern.win > bottomLimit) {
                break;
            }
            if (calcCount++ > 100) {
                bottomLimit = -1;
            }
        }
        return pattern;
    };

    Player.prototype.findFreeByRtp = function (minMoney, maxMoney) {
        return this.machine.SpinForJackpot(
            this.betPerLine,
            this.virtualBet,
            Util.random(minMoney, maxMoney),
            false,
            "RANDOM"
        );
    };

    Player.prototype.findBuyBonus = function (maxLimit) {
        console.log(maxLimit);
        let buyPattern = null;
        let minMoney = maxLimit * 0.5;
        let maxMoney = maxLimit;

        let lowerLimit = 0;
        let upperLimit = 100000000000000;
        let lowerPattern = null;
        let upperPattern = null;

        for (let patternIndex = 0; patternIndex < 100; patternIndex++) {
            let pattern = this.machine.SpinForBuyBonus(this.virtualBet / this.machine.lineCount, this.virtualBet);

            if (pattern.win >= minMoney && pattern.win <= maxMoney) {
                buyPattern = pattern;
                break;
            }

            if (pattern.win > lowerLimit && pattern.win < minMoney) {
                lowerLimit = pattern.win;
                lowerPattern = pattern;
            }
            if (pattern.win > maxMoney && pattern.win < upperLimit) {
                upperLimit = pattern.win;
                upperPattern = pattern;
            }
        }

        return buyPattern ? buyPattern : lowerPattern ? lowerPattern : upperPattern;
    };

    Player.prototype.Save = async function (param = {}) {
        if (param.action == "doInit") {
            delete this.lastPattern;
        }

        ++this.curIndex;
   
        this.machine = JSON.stringify(this.machine); // machine                              getDataValue('machine')                     .                     object               string       .
        this.lastPattern = JSON.stringify(this.lastPattern);
        this.viewStack = JSON.stringify(this.viewStack);
        this.fsStack = JSON.stringify(this.fsStack);
        this.viewHistory = JSON.stringify(this.viewHistory);
        this.replayLogList = JSON.stringify(this.replayLogList);
        this.callPattern = JSON.stringify(this.callPattern);
        this.purchaseCallPattern = JSON.stringify(this.purchaseCallPattern);

        await this.Save_DB_and_REDIS(this.dataValues);
    };

    Player.prototype.Update = async function (obj, patReq = 0) {
        Object.assign(this, obj);
        await this.Save_DB_and_REDIS(obj, patReq);
    };

    Player.prototype.Save_DB_and_REDIS = async function (obj, patReq = 0) {
        await this.SaveRedis(obj, patReq);
        var [result] = await app.db.sequelize.query(
            `SELECT id FROM players WHERE agentCode = '${this.agentCode}' AND userCode = '${this.userCode}' AND gameCode = '${this.gameCode}'`
        );
        if (result.length > 0) {
            let valueStrArr = [];
            for (const key in obj) {
                if (key != "id") {
                    if (typeof obj[key] == "object" && (key == "callPattern" || key == "purchaseCallPattern")) {
                        obj[key] = JSON.stringify(obj[key]);
                    }
                    if (key == "createdAt" || key == "updatedAt") {
                        continue;
                    }
                    valueStrArr.push(`${key} = ${JSON.stringify(obj[key])}`);
                }
            }
            app.db.sequelize.query(`UPDATE players SET ${valueStrArr.join(", ")} WHERE id = ${this.id}`).catch((t) => {
                //     SEQUELIZE           await                                                   2022-11-27                                           .                            .
                console.log("                          ", t, obj);
            });
        } else {
            let valueStrArr = [];
            let keyStrArr = [];
            for (const key in this.dataValues) {
                if (typeof this.dataValues[key] == "object") {
                    obj[key] = JSON.stringify(this.dataValues[key]);
                } else {
                    obj[key] = this.dataValues[key];
                }
                keyStrArr.push(`${key}`);
                valueStrArr.push(`${JSON.stringify(obj[key])}`);
            }
            const query = `INSERT INTO players (${keyStrArr.join(", ")}) VALUES (${valueStrArr.join(", ")})`;
            app.db.sequelize.query(query).catch((t) => {
                //     SEQUELIZE           await                                                   2022-11-27                                           .                            .
            });
        }
    };

    Player.prototype.SaveRedis = async function (obj, patReq = 0) {
        let redisObj = JSON.parse(await EUtil.getFromRedis(app, `player_${this.agentCode}__${this.userCode}`));
        if (!redisObj) {
            redisObj = {};
        }
        if (!redisObj[this.gameCode]) {
            redisObj[this.gameCode] = this.toJSON();
        }
        for (const key in obj) {
            if ((!patReq && key != "patRequested") || (patReq && key == "patRequested")) {
                redisObj[this.gameCode][key] = obj[key];
            }
        }
        await app.redis_client.set(`player_${this.agentCode}__${this.userCode}`, JSON.stringify(redisObj));
    };

    Player.prototype.Get = function (user, cmd) {
        return {
            bet: this.virtualBet,
            betPerLine: this.betPerLine,
            lineCount: this.machine.lineCount,
            viewStack: cmd < 3 ? this.viewStack : [],
            fsStack: cmd < 3 ? this.fsStack : [],
            viewHistory: this.viewHistory,
            targetRtp: user.targetRtp,
            buyMulti: this.machine.buyMulti,
            gameMode: this.gameMode,
            jackpotCome: this.jackpotCome,
            baseWinCome: this.baseWinCome,
            highBaseCome: this.highBaseCome,
            jackpotLimit: this.jackpotLimit,
            highBaseLimit: this.highBaseLimit,
        };
    };

    Player.prototype.RegenPatterns = async function (user) {
        return GeneratePatterns(this, user);
    };

    Player.prototype.RegenBuyPatterns = async function (user) {
        return GenerateBuyFreeSpinPatterns(this, user);
    };

    app.db.Player = Player;
};

async function CheckPatternEnough(_player, _user, _param) {
    // agentAPI                           return
    if (Object.keys(_param).length == 0 || _player.gameMode != 1) {
        return;
    }
    if (
        (1 == _player.patRequested && _player.viewStack.length >= 22) ||
        (_player.viewStack.length < 22 && _player.viewStack.length % 7 != 0)
    ) {
        //
        //                                                             22                       7
        return;
    }
    let jsonBody = {
        agentCode: _player.agentCode,
        userCode: _player.userCode,
        gameCode: _player.gameCode,
    };
    const lowLimit = 50; //_player.machine.lowLimit

    if (_player.betIncreased || !_player.viewStack || _player.viewStack.length <= lowLimit) {
        let _playerObj = { patRequested: 1 };

        if (_player.betIncreased) {
            (_playerObj.betPerLine = _player.betPerLine), (_playerObj.virtualBet = _player.virtualBet);
            _player.logHist(`[                 ,                   ...] >>>>>>>>>>>>>>`);
        }
        if (!_player.viewStack) {
            _player.logHist(`[                    ,                   ...] >>>>>>>>>>>>>>`);
        }
        if (_player.viewStack.length < lowLimit) {
            _player.logHist(
                `[                        ,                   ...] >>>>>>>>>>>>>>          :${_player.viewStack.length},       :${lowLimit}`
            );
        }

        jsonBody.cmd = 1;
        await _player.Update(_playerObj, 1);
        let ret = await patternRequest(_player, "                  ", jsonBody);

        //                       GeneratePatterns
        // const patterns = GeneratePatterns(_player, _user);
        if (ret.status == 200) {
            const { patterns } = ret.data;
            _player.viewStack = _player.viewStack
                .slice(0, lowLimit)
                .filter((e) => e && e.type == "BASE")
                .concat(patterns);
            await _player.Update({ viewStack: JSON.stringify(_player.viewStack) });
        }
    }

    if (_player.machine.buyMulti && (!_player.fsStack || _player.fsStack.length < lowLimit)) {
        _player.logHist(`[Regenerate Buy FreeSpin Patterns...]\n`);

        jsonBody.cmd = 2;
        await _player.Update({ patRequested: 1 }, 1);
        let ret = await patternRequest(_player, "                  ", jsonBody);

        //                       GenerateBuyFreeSpinPatterns
        // const patterns = GenerateBuyFreeSpinPatterns(_player, _user);
        if (ret.status == 200) {
            const { patterns } = ret.data;
            _player.fsStack = _player.fsStack.concat(patterns);
            await _player.Update({ fsStack: JSON.stringify(_player.fsStack) });
        }
    }
    if (1 == _player.patRequested) {
        await _player.Update({ patRequested: 0 }, 1);
    }
    return;
}

async function patternRequest(player, graphName, jsonBody) {
    let ret = { status: 0 };
    try {
        ret = await axios.post(`${PAT_SERVER_URL}/api/regen_pattern`, jsonBody, { timeout: 12000 });

        if (ret.status == 0) {
            player.logHist(`CheckPatternEnough > ${ret.msg}`);
            ret.data.patterns = [];
        } else {
            player.logHist(`[             ->             ] CheckPatternEnough > ${graphName}                       `);
        }
    } catch (e) {
        player.logHist(`[             ->             ] CheckPatternEnough > ${graphName}                       `);
        logger.info(e);
    }
    return ret;
}

function GeneratePatterns(_player, _user, _options = null) {
    let user = {
        targetRtp: _user.targetRtp,
    };
    _player.logHist(
        `[                           ----]\t            : ${_player.totalCredit}/${_player.totalDebit},    : ${_user.totalCredit}/${_user.totalDebit}`
    );
    const viewStack = [];
    const lowLimit = 50; // _player.machine.lowLimit

    if (_player.gameCode == "vs25kingdoms") {
        //
        if (_player.viewStack.length > 0) {
            _player.machine.trophyScoreForPT = _player.viewStack[lowLimit - 1].score;
            _player.machine.trophyWinForPT = _player.viewStack[lowLimit - 1].winm;
        } else {
            _player.machine.trophyScoreForPT = _player.machine.trophyScore;
            _player.machine.trophyWinForPT = _player.machine.trophyWin;
        }
    } else if (_player.gameCode == "vs20gorilla") {
        //
        if (_player.viewStack.length > 0) {
            _player.machine.prevMultiList = _player.viewStack[lowLimit - 1].nextMulti;
        } else {
            _player.machine.prevMultiList = _player.machine.currentMultiList;
        }
    }

    if (_player.betPerLine == 0) {
        _player.betPerLine = 10;
        _player.virtualBet = 10 * _player.machine.lineCount;
    }

    for (let i = 0; i < _player.machine.patternCount; i++) {
        const pattern = _player.nextPattern(user);
        _player.totalDebit += pattern.bpl * _player.machine.lineCount;
        _player.totalCredit += pattern.win;
        _player.realRtp = (_player.totalCredit / _player.totalDebit) * 100;
        ++_player.curIndex;
        viewStack.push(pattern);
    }

    // _player.logHist(`${JSON.stringify(viewStack).length}           >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
    return viewStack;
}

function GenerateBuyFreeSpinPatterns(_player, user, _options = null) {
    var calcData = {
        totalIncome: 0,
        totalOutgo: 0,
        rtp: 0,
    };
    var machine = _player.machine;

    //
    const betPerLine = 10;
    const totalBet = machine.lineCount * betPerLine;

    var buyMoney = totalBet * machine.buyMulti;
    var lowCnt = 30;
    var highCnt = 30;
    var lowPattern = []; //         -                            //              0.1 ~ 0.8
    var highPattern = []; //         -                            //              1 ~ 5

    var calcCnt = 0;
    while (true) {
        var pattern = machine.SpinForBuyBonus(betPerLine, totalBet);

        if (pattern.win > buyMoney * 0.1 && pattern.win < buyMoney * 1 && lowPattern.length < lowCnt) {
            lowPattern.push(pattern);
        }

        if (pattern.win > buyMoney * 1 && pattern.win < buyMoney * 3 && highPattern.length < highCnt) {
            if (pattern.win < 100000) {
                highPattern.push(pattern);
            }
        }

        if (lowPattern.length >= lowCnt && highPattern.length >= highCnt) {
            break;
        }
        calcCnt++;
    }

    const fsStack = [];

    var buyRTP = 0;
    for (var i = 0; i < 30; i++) {
        var pattern;

        pattern = lowPattern.shift();
        fsStack.push(pattern);

        if (buyRTP < user.targetRtp - 10 && i > 3 && i < 18) {
            pattern = highPattern.shift();
            fsStack.push(pattern);

            _player.logHist(i + ".                     2");
        }

        calcData.totalOutgo += buyMoney;
        calcData.totalIncome += pattern.win;
        buyRTP = (calcData.totalIncome / calcData.totalOutgo) * 100;

        // _player.logHist(`totalIncome: ${calcData.totalIncome}, totalOutgo: ${calcData.totalOutgo}, buyRTP: ${buyRTP}%, rtp: ${user.}%`);
    }
    calcData.rtp = buyRTP;

    _player.logHist(`[                             ${calcCnt}          ], [         ]: ${calcData.rtp}`);

    return fsStack;
}
