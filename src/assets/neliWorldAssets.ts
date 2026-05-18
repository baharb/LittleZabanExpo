import { characterAssets } from './characterAssets';

type RoomVariantSet = {
  phone?: any;
  tabletPortrait?: any;
  tabletLandscape?: any;
  universal?: any;
  premium?: any;
  master?: any;
};

function pickRoomBackground(variants: RoomVariantSet, width: number, height: number) {
  const isLandscape = width >= height;
  const aspect = width / height;
  const largestSide = Math.max(width, height);

  if (largestSide >= 1400) {
    return variants.master ?? variants.premium ?? variants.universal ?? variants.phone ?? variants.tabletPortrait ?? variants.tabletLandscape;
  }

  if (isLandscape) {
    if (aspect <= 1.48 && variants.tabletLandscape) return variants.tabletLandscape;
    return variants.universal ?? variants.premium ?? variants.phone ?? variants.tabletPortrait ?? variants.tabletLandscape;
  }

  if (aspect >= 0.68 && variants.tabletPortrait) return variants.tabletPortrait;
  return variants.phone ?? variants.universal ?? variants.premium ?? variants.tabletPortrait ?? variants.tabletLandscape;
}

const bathroomSceneBackgrounds = {
  phone: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_phone_2796x1290_app_webp_q95.webp'),
  tabletPortrait: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_tablet_2732x2048_app_webp_q95.webp'),
  tabletLandscape: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_tablet_2732x2048_app_webp_q95.webp'),
  universal: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_universal_3840x2160_app_webp_q95.webp'),
  premium: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_premium_4096x2304_app_webp_q95.webp'),
  master: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_master_8000x4500_app_webp_q95.webp'),
} as const;

const livingRoomBackgrounds = {
  phone: require('../../assets/neli-world/backgrounds/Living Room/living_room_lavender_phone_2796x1290_app_webp_q95.webp'),
  tabletPortrait: require('../../assets/neli-world/backgrounds/Living Room/living_room_lavender_tablet_2732x2048_app_webp_q95.webp'),
  tabletLandscape: require('../../assets/neli-world/backgrounds/Living Room/living_room_lavender_tablet_2732x2048_app_webp_q95.webp'),
  universal: require('../../assets/neli-world/backgrounds/Living Room/living_room_lavender_universal_3840x2160_app_webp_q95.webp'),
  premium: require('../../assets/neli-world/backgrounds/Living Room/living_room_lavender_premium_4096x2304_app_webp_q95.webp'),
  master: require('../../assets/neli-world/backgrounds/Living Room/living_room_lavender_master_8000x4500_app_webp_q95.webp'),
} as const;

const brushTeethRoomBackgrounds = {
  phone: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_phone_2796x1290_app_webp_q95.webp'),
  tabletPortrait: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_tablet_2732x2048_app_webp_q95.webp'),
  tabletLandscape: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_tablet_2732x2048_app_webp_q95.webp'),
  universal: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_universal_3840x2160_app_webp_q95.webp'),
  premium: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_premium_4096x2304_app_webp_q95.webp'),
  master: require('../../assets/neli-world/backgrounds/Bathroom/bathroom_scene_master_8000x4500_app_webp_q95.webp'),
} as const;

const bedroomBackgrounds = {
  final: {
    phone: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_1448x1086.webp'),
    tabletPortrait: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_ipad_pro_2732x2048.webp'),
    tabletLandscape: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_tablet_2048x1536.webp'),
    universal: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_4096x3072.webp'),
    premium: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_4096x3072.webp'),
    master: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_max_5792x4344.webp'),
  },
  v2: {
    phone: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_1448x1086.webp'),
    tabletPortrait: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_ipad_pro_2732x2048.webp'),
    tabletLandscape: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_tablet_2048x1536.webp'),
    universal: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_4096x3072.webp'),
    premium: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_4096x3072.webp'),
    master: require('../../assets/neli-world/backgrounds/Bedroom/kids_bedroom_max_5792x4344.webp'),
  },
  dressUp: {
    phone: require('../../assets/neli-world/backgrounds/Bedroom-dressup/landscape_16x9_1280x720.webp'),
    tabletPortrait: require('../../assets/neli-world/backgrounds/Bedroom-dressup/landscape_4x3_2048x1536.webp'),
    tabletLandscape: require('../../assets/neli-world/backgrounds/Bedroom-dressup/landscape_16x10_1920x1200.webp'),
    universal: require('../../assets/neli-world/backgrounds/Bedroom-dressup/landscape_16x9_1920x1080.webp'),
    premium: require('../../assets/neli-world/backgrounds/Bedroom-dressup/landscape_16x9_2560x1440.webp'),
    master: require('../../assets/neli-world/backgrounds/Bedroom-dressup/landscape_16x9_3840x2160.webp'),
  },
} as const;

const kitchenBackgrounds = {
  brightAndCheerful: {
    phone: require('../../assets/neli-world/backgrounds/Kitchen/bright_and_cheerful_kitchen_interior_phone_2796x1290.png'),
    tabletPortrait: require('../../assets/neli-world/backgrounds/Kitchen/bright_and_cheerful_kitchen_interior_tablet_2732x2048.png'),
    tabletLandscape: require('../../assets/neli-world/backgrounds/Kitchen/bright_and_cheerful_kitchen_interior_tablet_2732x2048.png'),
    universal: require('../../assets/neli-world/backgrounds/Kitchen/bright_and_cheerful_kitchen_interior_universal_3840x2160.png'),
    premium: require('../../assets/neli-world/backgrounds/Kitchen/bright_and_cheerful_kitchen_interior_premium_4096x2304.png'),
    master: require('../../assets/neli-world/backgrounds/Kitchen/bright_and_cheerful_kitchen_interior_master_8000x4500.png'),
  },
  colorfulAndCozy: {
    phone: require('../../assets/neli-world/backgrounds/Kitchen/colorful_and_cozy_kitchen_interior_phone_2796x1290.png'),
    tabletPortrait: require('../../assets/neli-world/backgrounds/Kitchen/colorful_and_cozy_kitchen_interior_tablet_2732x2048.png'),
    tabletLandscape: require('../../assets/neli-world/backgrounds/Kitchen/colorful_and_cozy_kitchen_interior_tablet_2732x2048.png'),
    universal: require('../../assets/neli-world/backgrounds/Kitchen/colorful_and_cozy_kitchen_interior_universal_3840x2160.png'),
    premium: require('../../assets/neli-world/backgrounds/Kitchen/colorful_and_cozy_kitchen_interior_premium_4096x2304.png'),
    master: require('../../assets/neli-world/backgrounds/Kitchen/colorful_and_cozy_kitchen_interior_master_8000x4500.png'),
  },
  landscape: {
    phone: require('../../assets/neli-world/backgrounds/Kitchen/kitchen_landscape_1280x720.webp'),
    tabletPortrait: require('../../assets/neli-world/backgrounds/Kitchen/kitchen_landscape_2048x1536.webp'),
    tabletLandscape: require('../../assets/neli-world/backgrounds/Kitchen/kitchen_landscape_2048x1536.webp'),
    universal: require('../../assets/neli-world/backgrounds/Kitchen/kitchen_landscape_1920x1080.webp'),
    premium: require('../../assets/neli-world/backgrounds/Kitchen/kitchen_landscape_2560x1440.webp'),
    master: require('../../assets/neli-world/backgrounds/Kitchen/kitchen_landscape_3840x2160.webp'),
  },
} as const;

const playgroundBackgrounds = {
  phone: require('../../assets/neli-world/backgrounds/Playground/playground_final_phone_2796x1290_app_webp_q95.webp'),
  tabletPortrait: require('../../assets/neli-world/backgrounds/Playground/playground_final_tablet_2732x2048_app_webp_q95.webp'),
  tabletLandscape: require('../../assets/neli-world/backgrounds/Playground/playground_final_tablet_2732x2048_app_webp_q95.webp'),
  universal: require('../../assets/neli-world/backgrounds/Playground/playground_final_universal_3840x2160_app_webp_q95.webp'),
  premium: require('../../assets/neli-world/backgrounds/Playground/playground_final_premium_4096x2304_app_webp_q95.webp'),
  master: require('../../assets/neli-world/backgrounds/Playground/playground_final_master_8000x4500_app_webp_q95.webp'),
} as const;

const yardBackgrounds = {
  phone: require('../../assets/neli-world/backgrounds/Yard/outside_yard_scene_phone_2796x1290.webp'),
  tabletPortrait: require('../../assets/neli-world/backgrounds/Yard/outside_yard_scene_tablet_2732x2048.webp'),
  tabletLandscape: require('../../assets/neli-world/backgrounds/Yard/outside_yard_scene_tablet_2732x2048.webp'),
  universal: require('../../assets/neli-world/backgrounds/Yard/outside_yard_scene_universal_3840x2160.webp'),
  premium: require('../../assets/neli-world/backgrounds/Yard/outside_yard_scene_premium_4096x2304.webp'),
  master: require('../../assets/neli-world/backgrounds/Yard/outside_yard_scene_master_8000x4500.webp'),
} as const;

export const roomBackgroundVariants = {
  bathroom: bathroomSceneBackgrounds,
  brushTeethBathroom: brushTeethRoomBackgrounds,
  bedroom: bedroomBackgrounds,
  kitchen: kitchenBackgrounds,
} as const;

export const roomBackgroundPickers = {
  bathroom: (width: number, height: number) => pickRoomBackground(bathroomSceneBackgrounds, width, height),
  brushTeethBathroom: (width: number, height: number) => pickRoomBackground(brushTeethRoomBackgrounds, width, height),
  bedroom: (width: number, height: number) => pickRoomBackground(bedroomBackgrounds.dressUp, width, height),
  talkPlay: (width: number, height: number) => pickRoomBackground(livingRoomBackgrounds, width, height),
  kitchen: (width: number, height: number) => pickRoomBackground(kitchenBackgrounds.landscape, width, height),
} as const;

export const neliWorldAssets = {
  characters: {
    aidin: characterAssets.aidin.base,
    dara: characterAssets.dara.base,
    lila: characterAssets.lila.base,
    mila: characterAssets.mila.base,
    neli: characterAssets.neli.base,
    neliBlinkOverlay: require('../../assets/neli-world/characters/Neli/01_nelly_blink_overlay.png'),
    neliConfirmedTransparent: require('../../assets/neli-world/characters/neli_confirmed_transparent.png'),
  },
  neliPosesPremium: {
    brushingTeeth: require('../../assets/neli-world/characters/neli-poses-premium/brushing_teeth.png'),
    cooking: require('../../assets/neli-world/characters/neli-poses-premium/cooking.png'),
    happy: require('../../assets/neli-world/characters/neli-poses-premium/happy.png'),
    sleeping: require('../../assets/neli-world/characters/neli-poses-premium/sleeping.png'),
    talking: require('../../assets/neli-world/characters/neli-poses-premium/talking.png'),
    waving: require('../../assets/neli-world/characters/neli-poses-premium/waving.png'),
  },
  animations: {
    neli: {
      walk: [
        require('../../assets/neli-world/animations/neli/walk_01.png'),
        require('../../assets/neli-world/animations/neli/walk_02.png'),
        require('../../assets/neli-world/animations/neli/walk_03.png'),
        require('../../assets/neli-world/animations/neli/walk_04.png'),
      ],
      run: [
        require('../../assets/neli-world/animations/neli/run_01.png'),
        require('../../assets/neli-world/animations/neli/run_02.png'),
        require('../../assets/neli-world/animations/neli/run_03.png'),
        require('../../assets/neli-world/animations/neli/run_04.png'),
      ],
      laugh: [
        require('../../assets/neli-world/animations/neli/laugh_open.png'),
        require('../../assets/neli-world/animations/neli/laugh_closed.png'),
      ],
      talk: [
        require('../../assets/neli-world/animations/neli/laugh_closed.png'),
        require('../../assets/neli-world/animations/neli/talk_open.png'),
      ],
      brushTeeth: [
        require('../../assets/neli-world/animations/neli/brush_teeth_open.png'),
        require('../../assets/neli-world/animations/neli/talk_open.png'),
      ],
    },
    giraffe: {
      walk: [
        require('../../assets/neli-world/animations/giraffe/walk_01.png'),
        require('../../assets/neli-world/animations/giraffe/walk_02.png'),
        require('../../assets/neli-world/animations/giraffe/walk_03.png'),
        require('../../assets/neli-world/animations/giraffe/walk_04.png'),
      ],
      run: [
        require('../../assets/neli-world/animations/giraffe/run_01.png'),
        require('../../assets/neli-world/animations/giraffe/run_02.png'),
        require('../../assets/neli-world/animations/giraffe/run_03.png'),
        require('../../assets/neli-world/animations/giraffe/run_04.png'),
      ],
      laugh: [
        require('../../assets/neli-world/animations/giraffe/laugh_open.png'),
        require('../../assets/neli-world/animations/giraffe/laugh_closed.png'),
      ],
      talk: [
        require('../../assets/neli-world/animations/giraffe/laugh_closed.png'),
        require('../../assets/neli-world/animations/giraffe/talk_open.png'),
      ],
      brushTeeth: [
        require('../../assets/neli-world/animations/giraffe/brush_teeth_open.png'),
        require('../../assets/neli-world/animations/giraffe/talk_open.png'),
      ],
    },
  },
  animals: {
    bear: require('../../assets/neli-world/animals/bear.png'),
    cat: require('../../assets/neli-world/animals/cat.png'),
    elephant: require('../../assets/neli-world/animals/elephant.png'),
    panda: require('../../assets/neli-world/animals/panda.png'),
    rabbit: require('../../assets/neli-world/animals/rabbit.png'),
  },
  bathroom: {
    toothbrush: require('../../assets/neli-world/bathroom/toothbrush.png'),
    toothpaste: require('../../assets/neli-world/bathroom/toothpaste.png'),
    bubbles: require('../../assets/neli-world/bathroom/bubbles.png'),
    waterSplash: require('../../assets/neli-world/bathroom/water_splash.png'),
    soap: require('../../assets/neli-world/bathroom/soap_dish.png'),
    towel: require('../../assets/neli-world/bathroom/towel.png'),
  },
    clothes: {
      apron: require('../../assets/neli-world/clothes/apron_blue.png'),
      backpack: require('../../assets/neli-world/clothes/backpack_blue.png'),
      beanie: require('../../assets/neli-world/clothes/beanie_blue.png'),
      boots: require('../../assets/neli-world/clothes/boots_purple.png'),
      bag: require('../../assets/neli-world/clothes/bag_pink.png'),
      bow: require('../../assets/neli-world/clothes/bow_pink.png'),
    crown: require('../../assets/neli-world/clothes/crown_yellow.png'),
    hanger: require('../../assets/neli-world/clothes/hanger.webp'),
    dress: require('../../assets/neli-world/clothes/dress_yellow.png'),
      dressBlue: require('../../assets/neli-world/clothes/dress_blue.png'),
      dressGreen: require('../../assets/neli-world/clothes/dress_green.png'),
      dressLong: require('../../assets/neli-world/clothes/dress_long_purple.png'),
      dressOrange: require('../../assets/neli-world/clothes/dress_orange.png'),
      dressPink: require('../../assets/neli-world/clothes/dress_pink.png'),
      dressRed: require('../../assets/neli-world/clothes/dress_red.png'),
      gloves: require('../../assets/neli-world/clothes/gloves_blue.png'),
      hat: require('../../assets/neli-world/clothes/hat_orange.png'),
      hatBlue: require('../../assets/neli-world/clothes/hat_blue.png'),
      hatPink: require('../../assets/neli-world/clothes/hat_pink.png'),
      pants: require('../../assets/neli-world/clothes/pants_green.png'),
      raincoat: require('../../assets/neli-world/clothes/raincoat_yellow.png'),
      scarf: require('../../assets/neli-world/clothes/scarf_blue.png'),
      shirt: require('../../assets/neli-world/clothes/shirt_blue.png'),
      shirtPink: require('../../assets/neli-world/clothes/shirt_pink.png'),
      shoes: require('../../assets/neli-world/clothes/shoes_blue.png'),
      shoesGold: require('../../assets/neli-world/clothes/shoes_gold.png'),
      shoesPink: require('../../assets/neli-world/clothes/shoes_pink.png'),
      shoesWhite: require('../../assets/neli-world/clothes/shoes_white.png'),
      shorts: require('../../assets/neli-world/clothes/shorts_purple.png'),
      skirt: require('../../assets/neli-world/clothes/skirt_pink.png'),
      socks: require('../../assets/neli-world/clothes/socks_pink.png'),
      sunglasses: require('../../assets/neli-world/clothes/sunglasses.png'),
      sunglassesBlack: require('../../assets/neli-world/clothes/sunglasses_black.png'),
      sunglassesGold: require('../../assets/neli-world/clothes/sunglasses_gold.png'),
      sunglassesPink: require('../../assets/neli-world/clothes/sunglasses_pink.png'),
      sunhat: require('../../assets/neli-world/clothes/sunhat_yellow.png'),
      sunhatCream: require('../../assets/neli-world/clothes/sunhat_cream.png'),
      sweater: require('../../assets/neli-world/clothes/sweater_green.png'),
    },
  foods: {
    apple: require('../../assets/neli-world/fruits/apple.png'),
    banana: require('../../assets/neli-world/fruits/banana.png'),
    bread: require('../../assets/neli-world/ingredients/bread.png'),
    beans: require('../../assets/neli-world/vegetables/peas.png'),
    carrot: require('../../assets/neli-world/vegetables/carrot.png'),
    cucumber: require('../../assets/neli-world/vegetables/cucumber.png'),
    cheese: require('../../assets/neli-world/food-flat/cheese.png'),
    egg: require('../../assets/neli-world/food-flat/egg.png'),
    fish: require('../../assets/neli-world/ingredients/salmon.png'),
    honey: require('../../assets/neli-world/food-flat/honey.png'),
    herbs: require('../../assets/neli-world/vegetables/celery.png'),
    driedMint: require('../../assets/neli-world/ingredients/herbs.png'),
    lemon: require('../../assets/neli-world/ingredients/lemon.png'),
    lentils: require('../../assets/neli-world/ingredients/lentils.png'),
    onion: require('../../assets/neli-world/vegetables/onion.png'),
    yogurt: require('../../assets/neli-world/food-flat/mast.png'),
    pasta: require('../../assets/neli-world/food-flat/pasta.png'),
    rice: require('../../assets/neli-world/ingredients/rice.png'),
    salt: require('../../assets/neli-world/ingredients/salt.png'),
    tomato: require('../../assets/neli-world/vegetables/tomato.png'),
    water: require('../../assets/neli-world/ingredients/water.png'),
  },
  giraffe: {
    brushing: characterAssets.dara.poses.walking,
    cooking: characterAssets.dara.poses.cooking,
    happy: characterAssets.dara.poses.reading,
    waving: characterAssets.dara.poses.waving,
  },
  giraffePosesPremium: {
    brushingTeeth: characterAssets.dara.poses.brushing,
    cooking: characterAssets.dara.poses.cooking,
    happy: characterAssets.dara.poses.jumping,
    runningLaughing: characterAssets.dara.poses.running,
    talking: characterAssets.dara.poses.walking,
    waving: characterAssets.dara.poses.celebration,
  },
  kitchen: {
    bowl: require('../../assets/neli-world/kitchen/bowl.png'),
    oil: require('../../assets/neli-world/kitchen/oil.png'),
    pan: require('../../assets/neli-world/kitchen/pan.png'),
    plate: require('../../assets/neli-world/kitchen/plate.png'),
    pot: require('../../assets/neli-world/kitchen/pot.png'),
  },
  persianFoods: {
    ashReshteh: require('../../assets/neli-world/persian-foods/ash_reshteh.png'),
    dolme: require('../../assets/neli-world/persian-foods/dolme.png'),
    fesenjan: require('../../assets/neli-world/persian-foods/fesenjan.png'),
    ghormeSabzi: require('../../assets/neli-world/persian-foods/ghorme_sabzi.png'),
    jooje: require('../../assets/neli-world/persian-foods/jooje.png'),
    kebab: require('../../assets/neli-world/persian-foods/kebab.png'),
    kukuSabzi: require('../../assets/neli-world/persian-foods/kuku_sabzi.png'),
    lavash: require('../../assets/neli-world/persian-foods/lavash.png'),
    mastKhiar: require('../../assets/neli-world/persian-foods/mast_khiar.png'),
    omelette: require('../../assets/neli-world/food-flat/egg.png'),
    pasta: require('../../assets/neli-world/food-flat/pasta.png'),
    sabziPolo: require('../../assets/neli-world/persian-foods/sabzi_polo.png'),
    shiraziSalad: require('../../assets/neli-world/persian-foods/shirazi_salad.png'),
    tahchin: require('../../assets/neli-world/persian-foods/tahchin.png'),
    tea: require('../../assets/neli-world/persian-foods/tea.png'),
    zereshkPolo: require('../../assets/neli-world/persian-foods/zereshk_polo.png'),
  },
  rooms: {
    bathroom: bathroomSceneBackgrounds.universal,
    brushTeethBathroom: bathroomSceneBackgrounds.universal,
    brushTeethBathroomPortrait: bathroomSceneBackgrounds.phone,
    brushTeethBathroomTabletLandscape: bathroomSceneBackgrounds.tabletLandscape,
    brushTeethBathroomTabletPortrait: bathroomSceneBackgrounds.tabletPortrait,
    cookingTable: kitchenBackgrounds.landscape.universal,
    cookingTableTabletLandscape: kitchenBackgrounds.landscape.tabletLandscape,
    cookingTableTabletPortrait: kitchenBackgrounds.landscape.tabletPortrait,
    feedAnimalsJungle: require('../../assets/neli-world/backgrounds/Jungle/jungle_landscape_3840x2160.webp'),
    feedAnimalsJunglePortrait: require('../../assets/neli-world/backgrounds/Jungle/jungle_phone_portrait_1080x1920.webp'),
    feedAnimalsJungleTabletLandscape: require('../../assets/neli-world/backgrounds/Jungle/jungle_tablet_landscape_2732x2048.webp'),
    feedAnimalsJungleTabletPortrait: require('../../assets/neli-world/backgrounds/Jungle/jungle_tablet_portrait_1668x2224.webp'),
    bedroom: bedroomBackgrounds.final.universal,
    garden: yardBackgrounds.universal,
    kitchen: kitchenBackgrounds.landscape.universal,
    livingRoom: livingRoomBackgrounds.universal,
    talkPlay: livingRoomBackgrounds.universal,
    talkPlayPortrait: livingRoomBackgrounds.phone,
    talkPlayTabletLandscape: livingRoomBackgrounds.tabletLandscape,
    talkPlayTabletPortrait: livingRoomBackgrounds.tabletPortrait,
    talkPlayStageLandscape: livingRoomBackgrounds.universal,
    talkPlayWide: livingRoomBackgrounds.master,
    splashLandscape: bedroomBackgrounds.final.universal,
    splashPortrait: bedroomBackgrounds.final.phone,
    studyRoom: bedroomBackgrounds.final.universal,
  },
  ui: {
    back: require('../../assets/neli-world/ui-icons/ui/back.png'),
    book: require('../../assets/neli-world/ui-icons/book.png'),
    camera: require('../../assets/neli-world/ui-icons/camera.png'),
    close: require('../../assets/neli-world/ui-icons/ui/close.png'),
    gamepad: require('../../assets/neli-world/ui-icons/gamepad.png'),
    heart: require('../../assets/neli-world/ui-icons/heart.png'),
    home: require('../../assets/neli-world/ui-icons/home.png'),
    lock: require('../../assets/neli-world/ui-icons/lock.png'),
    microphone: require('../../assets/neli-world/ui-icons/microphone.png'),
    next: require('../../assets/neli-world/ui-icons/ui/next.png'),
    ok: require('../../assets/neli-world/ui-icons/ui/ok.png'),
    paintbrush: require('../../assets/neli-world/ui-icons/paintbrush.png'),
    pause: require('../../assets/neli-world/ui-icons/ui/pause.png'),
    play: require('../../assets/neli-world/ui-icons/ui/play.png'),
    restart: require('../../assets/neli-world/ui-icons/restart.png'),
    rainbow: require('../../assets/neli-world/ui-icons/rainbow.png'),
    settings: require('../../assets/neli-world/ui-icons/settings.png'),
    sparkle: require('../../assets/neli-world/ui-icons/sparkle.png'),
    spoon: require('../../assets/neli-world/ui-icons/spoon.png'),
    star: require('../../assets/neli-world/ui-icons/star.png'),
    brush: require('../../assets/neli-world/ui-icons/brush.png'),
    toothbrush: require('../../assets/neli-world/ui-icons/toothbrush.png'),
    trophy: require('../../assets/neli-world/ui-icons/trophy.png'),
    voice: require('../../assets/neli-world/ui-icons/voice.png'),
    stop: require('../../assets/neli-world/ui-icons/ui/stop.png'),
  },
} as const;
