import type { Food } from './foods';

export type Language = 'vi' | 'en';

export const copy = {
  vi: {
    tiers: ['QUỐC DÂN', 'HIẾM', 'CỰC PHẨM', 'TỐI MẬT', '★ ĐẶC BIỆT'],
    title: 'Mở hòm món ăn', counterPrefix: 'Đã ghi nhận', counterSuffix: 'hòm',
    counterTitle: 'Lượt quay hoàn tất được ghi nhận trên website này', caseLabel: 'Mở hòm món ăn',
    soundOn: 'Âm thanh bật', soundOff: 'Âm thanh tắt', turnSoundOff: 'Tắt âm thanh', turnSoundOn: 'Bật âm thanh',
    github: 'Mở mã nguồn trên GitHub', starsPending: 'chưa tải', language: 'Switch to English',
    spend: 'Mức chi tối đa', custom: 'Tuỳ chỉnh', customSpend: 'Mức tối đa tuỳ chỉnh (nghìn đồng)',
    spendUnit: 'nghìn / bữa', vegetarianPool: 'Pool hiện tại: trung bình',
    vegetarianOnly: 'Chỉ ăn chay', vegetarian: 'Ăn chay', opening: 'ĐANG MỞ HÒM…', openAgain: 'MỞ LẠI', open: 'MỞ HÒM',
    newItem: 'VẬT PHẨM MỚI', referencePrice: 'Giá tham khảo', perPerson: '/ người', find: 'TÌM QUÁN', continue: 'TIẾP TỤC', nearby: 'gần đây',
    whatsInside: 'TRONG HÒM CÓ GÌ?', items: 'Vật phẩm trong hòm', mystery: '★ MÓN BÍ ẨN', mysteryAlt: 'Món bí ẩn hạng vàng',
    footer: 'Fan-made · SFX: Valve /', dish: 'Món ăn', vegetarianDish: 'Chay',
    emptyCase: 'Hòm của bạn đang trống',
    emptyCaseHint: 'Chọn món có sẵn hoặc thêm món của riêng bạn để bắt đầu quay.',
    vegEmpty: 'Hòm chưa có món chay nào. Tắt bộ lọc chay hoặc thêm món chay.',
    spendEmpty: 'Không có món nào trong mức chi này. Nâng mức tối đa hoặc thêm món rẻ hơn.',
  },
  en: {
    tiers: ['MIL-SPEC', 'RESTRICTED', 'CLASSIFIED', 'COVERT', '★ SPECIAL ITEM'],
    title: 'Open a food case', counterPrefix: 'Recorded', counterSuffix: 'cases',
    counterTitle: 'Completed spins recorded on this website', caseLabel: 'Open a food case',
    soundOn: 'Sound on', soundOff: 'Sound off', turnSoundOff: 'Mute sound', turnSoundOn: 'Enable sound',
    github: 'Open source on GitHub', starsPending: 'not loaded', language: 'Chuyển sang tiếng Việt',
    spend: 'Max spend', custom: 'Custom', customSpend: 'Custom max (USD)',
    spendUnit: 'USD / meal', vegetarianPool: 'Current pool average',
    vegetarianOnly: 'Vegetarian only', vegetarian: 'Vegetarian', opening: 'OPENING CASE…', openAgain: 'OPEN AGAIN', open: 'OPEN CASE',
    newItem: 'NEW ITEM', referencePrice: 'Typical Atlanta price', perPerson: '/ person', find: 'FIND NEARBY', continue: 'CONTINUE', nearby: 'near me',
    whatsInside: "WHAT'S IN THE CASE?", items: 'Items in this case', mystery: '★ MYSTERY DISH', mysteryAlt: 'Gold-tier mystery dish',
    footer: 'Fan-made · SFX: Valve /', dish: 'Dish', vegetarianDish: 'Vegetarian',
    emptyCase: 'Your case is empty',
    emptyCaseHint: 'Pick catalog dishes or add your own to start spinning.',
    vegEmpty: 'No vegetarian dishes in this case. Turn off the vegetarian filter or add one.',
    spendEmpty: 'No dishes at this price. Raise the max spend or add cheaper dishes.',
  },
} as const;

const englishNames: Record<number, string> = {
  0:'Broken rice with pork',1:'Beef pho',2:'Banh mi',3:'Grilled pork noodles',4:'Salmon sushi',5:'Pizza',6:'Fried chicken',7:'Vegetarian rice plate',8:'Bibimbap',
  9:'Hoi An chicken rice',10:'Hue beef noodle soup',11:'Hu tieu noodle soup',12:'Quang noodles',13:'Grilled pork vermicelli',14:'Steamed rice rolls',15:'Tofu noodles with shrimp paste',16:'Beef & pickle fried rice',17:'Shaking beef',18:'Vietnamese crispy pancake',19:'Crab red noodle soup',20:'Beef stir-fried noodles',21:'Fish noodle soup',22:'Fresh spring rolls',23:'Pork rib congee',
  24:'Ramen',25:'Udon',26:'Japanese curry rice',27:'Tteokbokki',28:'Beef burger',29:'Spaghetti bolognese',30:'Pad Thai',31:'Tom yum noodles',32:'Vegetarian mushroom hotpot',33:'Vegetarian mushroom noodles',34:'Vegetarian banh mi',35:'Vegetarian spring rolls',36:'Vietnamese rice plate',
  39:'Crispy chicken rice',42:'Crab tomato noodle soup',43:'Crab thick noodle soup',44:'Vietnamese steak & eggs',45:'Teriyaki chicken rice',46:'Tonkatsu rice',47:'Seafood fried rice',48:'Braised duck noodles',49:'Kimbap',50:'Korean mixed noodles',51:'Chicken breast salad',52:'Creamy bacon pasta',53:'Beef lasagna',54:'Cheeseburger & fries',55:'Pepperoni pizza',56:'Gyudon beef bowl',57:'Grilled mackerel rice',58:'Japanese soba',59:'Thai curry rice',60:'Tuna salad',61:'Quinoa chickpea salad',62:'Beef steak',63:'Pan-seared salmon',64:'Japanese eel rice',65:'Korean grilled beef rice',66:'Salmon teriyaki rice',67:'Salmon poke',68:'BBQ ribs',69:'Seafood pizza',70:'Seafood pasta',71:'Personal beef hotpot',
  72:'Chicken pho',73:'Pho rolls',74:'Pork meatball noodle soup',75:'Duck & bamboo noodle soup',76:'Southern beef noodle salad',77:'Fermented fish noodle soup',78:'Vegetarian noodle bowl',79:'Pork knuckle thick noodle soup',80:'Chicken glass noodle soup',81:'Eel glass noodle soup',82:'Duck congee',83:'Pork offal congee',84:'Roast pork rice vermicelli sheets',85:'Grilled pork sausage rolls',86:'Dim sum',87:'Wonton noodles',88:'Taiwanese beef noodles',89:'Crispy stir-fried noodles',90:'Singapore claypot rice',91:'Hainanese chicken rice',92:'Oyakodon chicken & egg rice',93:'Tempura rice bowl',94:'Spicy Korean noodles',95:'Jajangmyeon black bean noodles',96:'Naengmyeon cold noodles',97:'Kimchi stew with rice',98:'Soft tofu stew with rice',99:'Korean cheese chicken',100:'Kimchi fried rice',101:'Personal Thai hotpot',102:'Personal sukiyaki hotpot',103:'Indian curry & naan',104:'Chicken biryani',105:'Okonomiyaki',106:'Sandwich',107:'Doner kebab',108:'Chicken wrap',109:'Burrito',110:'Tacos',111:'Quesadilla',112:'Fish & chips',113:'Roast chicken & potatoes',114:'Mac & cheese',115:'Pesto pasta',116:'Salmon pasta',117:'Risotto',118:'Gnocchi',119:'Falafel & pita',
  120:'Beef macaroni stir-fry',121:'Chicken congee',122:'Vietnamese beef stew & banh mi',123:'Savory sticky rice',124:'Vietnamese skillet banh mi',125:'Char siu rice',126:'Roast duck rice',127:'Char siu noodles',128:'Stir-fried udon',129:'Chicken burger & fries',130:'Tomato mascarpone pasta',131:'Stir-fried glass noodles',
};

export function foodName(food: Food, language: Language) {
  return language === 'en' ? englishNames[food.image] ?? food.name : food.name;
}

export function foodSubtitle(food: Food, language: Language) {
  if (language === 'vi') return food.sub;
  return food.veg ? copy.en.vegetarianDish : copy.en.dish;
}

// Prices live in thousands of VND everywhere: the catalog, the cookies and the
// rarity thresholds in priceRarity. The English view restates them on an
// Atlanta lunch scale rather than converting at the market rate, which would
// price a 55k phở at $2.20 and say nothing about lunch where the English copy
// is read. It is a comparison of what lunch costs, not an exchange rate.
//
// The scale cannot be a single multiplier. The catalog spans 10x from a 25k
// bánh mì to a 260k risotto because Saigon prices a Western plate like an
// occasion; Atlanta lunch spans nearer 4x. Any factor that reads right at the
// counter end turns the risotto into a $78 dinner, and any factor that tames
// the risotto prices the bánh mì at pocket change. So the scale is a power
// curve pinned at both ends of the catalog instead: the cheapest dish and the
// dearest one are priced from Atlanta menus and everything between follows.
// That lands the rarity steps (40/65/100/130) at $11, $14, $18 and $21, with
// ★ SPECIAL above that up to the $32 splurge.
const CHEAPEST = { thousands: 25, usd: 8 }, DEAREST = { thousands: 260, usd: 32 };
export const USD_CURVE = Math.log(DEAREST.usd / CHEAPEST.usd) / Math.log(DEAREST.thousands / CHEAPEST.thousands);
export const USD_SCALE = CHEAPEST.usd / CHEAPEST.thousands ** USD_CURVE;
export const usdFromThousands = (thousands: number) => USD_SCALE * thousands ** USD_CURVE;
export const thousandsFromUsd = (usd: number) => Math.round((usd / USD_SCALE) ** (1 / USD_CURVE));

// What a custom dish may cost, in thousands of VND. The ceiling is a round
// number of dollars rather than of đồng because it is the English side that
// runs into it: the catalog tops out at a $32 lunch, so anyone adding a dish
// dearer than that is pricing a dinner out, in dollars. Stored VND follows the
// curve from there and lands wherever it lands.
export const PRICE_MIN = 10, PRICE_MAX = thousandsFromUsd(500);
// Spend bounds. The floor is the cheapest dish, since a ceiling under it
// empties the case; the ceiling matches the dearest dish anyone can add, so no
// dish a visitor creates is priced out of reach of its own spend control.
export const SPEND_MIN = CHEAPEST.thousands, SPEND_MAX = PRICE_MAX;

// Whole dollars on screen: these are "what this costs around here" figures, and
// a cent-exact $12.76 claims a precision the catalog never had. The spend input
// keeps its cents so a typed amount still round-trips to the same thousands.
export function priceLabel(thousands: number | string, language: Language, approximate = false) {
  const amount = Number(thousands);
  const formatted = language === 'en'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usdFromThousands(amount))
    : `${new Intl.NumberFormat('vi-VN').format(amount * 1000)}đ`;
  return `${approximate ? '~' : ''}${formatted}`;
}

// The bounds are one calculation, not a number repeated in two translations.
export const spendRangeHint = (language: Language) => language === 'en'
  ? `Enter ${priceLabel(SPEND_MIN, 'en')}–${priceLabel(SPEND_MAX, 'en')}.`
  : `Nhập từ ${SPEND_MIN} đến ${new Intl.NumberFormat('vi-VN').format(SPEND_MAX)} nghìn.`;
// The same bounds for the custom dish form, which validateProfile enforces.
export const priceRangeHint = (language: Language) => language === 'en'
  ? `Name: 1–60 characters, price: ${priceLabel(PRICE_MIN, 'en')}–${priceLabel(PRICE_MAX, 'en')}, up to 50 dishes.`
  : `Tên 1–60 ký tự, giá ${PRICE_MIN}–${new Intl.NumberFormat('vi-VN').format(PRICE_MAX)} nghìn, tối đa 50 món.`;

// Number inputs are typed in the currency on screen; what gets stored stays in
// thousands of VND, so switching language never rewrites a saved cookie.
export function amountToInput(thousands: number, language: Language) {
  return language === 'en' ? String(Number(usdFromThousands(thousands).toFixed(2))) : String(thousands);
}
export function amountFromInput(text: string, language: Language) {
  const value = Number(text);
  return language === 'en' ? thousandsFromUsd(value) : value;
}
export const amountStep = (language: Language) => (language === 'en' ? '0.25' : '1');
