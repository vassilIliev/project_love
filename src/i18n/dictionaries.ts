import type { Locale } from "./config";

const dictionaries = {
  bg: {
    meta: {
      title: "datememaybe.net — Покана за среща, на която не могат да ти откажат",
      description:
        'Създай персонализирана линк-покана за среща, на която половинката ти не може да каже "не". Буквално.',
      keywords: ["покана", "среща", "любов", "романтика", "споделяем линк", "date me maybe"],
    },
    nav: {
      brand: "datememaybe.net",
      cta: "Създай покана 💌",
    },
    hero: {
      heading1: "Искаш ли да направиш ",
      headingHighlight: "предложение, на което не могат да ти откажат",
      subtitle:
        'Създай персонализирана линк-покана, на която половинката ти не може да каже \u201eне\u201c. Буквално. 😏',
      ctaPrimary: "Създай своята сега 💌",
      ctaSecondary: "Виж примерна покана",
      scroll: "Разгледай",
    },
    demo: {
      recipientName: "Маги",
      time: "14.02 19:30",
      place: "В италианския ресторант",
      extraMessage: "Облечи нещо топло 💘",
    },
    create: {
      title: "Създай своята покана",
      subtitle: "Попълни детайлите и получи уникален линк за твоя crush!",
      stripeNote:
        "Ще бъдете пренасочен/а към Stripe за сигурно плащане. Имейлът Ви няма да бъде използван за маркетинг и няма да получавате рекламни съобщения.",
    },
    form: {
      privacyLabel: "Твоите данни са защитени",
      privacyTooltip:
        "Не съхраняваме данните ти на сървър и нямаме база данни. Цялата информация от поканата се криптира директно в линка, който получаваш. Никой — включително нас — не може да види или достъпи написаното от теб. Само човекът, на когото изпратиш линка, ще може да го отвори.",
      recipientLabel: "Име на получателя",
      recipientPlaceholder: "Напр. Маги",
      timeLabel: "Дата и час",
      timePlaceholder: "Напр. 14.02 в 19:30",
      placeLabel: "Място",
      placePlaceholder: "Напр. В италианския ресторант",
      messageLabel: "Допълнително съобщение",
      messagePlaceholder: "Напр. Облечи нещо топло 💘",
      requiredError: "Моля, въведи име на получателя.",
      genericError: "Нещо се обърка. Моля, опитай отново.",
      networkError: "Мрежова грешка. Моля, опитай отново.",
      maxChars: "Максимум {n} символа.",
      submitting: "Пренасочване към плащане...",
      submit: "Създай и плати €1.99",
      disclaimer:
        "Ще бъдете пренасочен/а към Stripe за сигурно плащане. Имейлът Ви няма да бъде използван за маркетинг и няма да получавате рекламни съобщения.",
    },
    invitation: {
      question: "ще излезеш ли на среща с мен?",
      yes: "ДА",
      no: "НЕ",
      hooray: "Ураа! 🎉",
      dateTime: "🕐 Дата и час:",
      place: "📍 Място:",
      seeYou: "✨ Ще се видим там! ✨",
    },
    copy: {
      ariaLabel: "Копирай линка",
      copied: "Копирано!",
      copy: "Копирай 📋",
    },
    success: {
      titleBefore: "Твоята ",
      titleBrand: "datememaybe",
      titleAfter: " покана е готова!",
      linkLabel: "Твоят уникален линк за покана:",
      qrLabel: "Или сканирай този QR код:",
      qrAlt: "QR код за линка на поканата",
      preview: "Прегледай поканата си 💝",
      tip: "Съвет: Изпрати линка чрез SMS, имейл или социални мрежи! 💬",
      paymentIncomplete: "Плащането не е завършено",
      paymentIncompleteDesc:
        "Изглежда плащането ти все още не е потвърдено. Моля, опитай отново.",
      backHome: "Към началото",
      error: "Нещо се обърка",
      errorDesc:
        "Не успяхме да потвърдим платежната ти сесия. Моля, свържи се с поддръжката, ако ти е било таксувано.",
    },
    cancel: {
      title: "Плащането е отменено",
      description:
        "Няма проблем! Поканата ти все още не е създадена. Можеш да опиташ отново, когато си готов/а.",
      backHome: "Обратно към началото 💕",
    },
    notFound: {
      title: "Поканата не е намерена",
      description: "Тази покана не съществува или вече не е активна.",
      createYours: "Създай своята ✉️",
    },
    footer: {
      text: "Направено с любов — Date Me Maybe",
    },
    og: {
      alt: "datememaybe.net — Покана за среща, на която не могат да ти откажат",
      subtitle: "Покана за среща, на която не могат да ти откажат 💕",
    },
  },

  en: {
    meta: {
      title: "datememaybe.net — A date invitation they can't refuse",
      description:
        'Create a personalized date invitation link that your special someone can\'t say "no" to. Literally.',
      keywords: ["invitation", "date", "love", "romance", "shareable link", "date me maybe"],
    },
    nav: {
      brand: "datememaybe.net",
      cta: "Create invite 💌",
    },
    hero: {
      heading1: "Want to make a ",
      headingHighlight: "date proposal they can't refuse",
      subtitle:
        'Create a personalized date invitation link that your special someone can\'t say "no" to. Literally. 😏',
      ctaPrimary: "Create yours now 💌",
      ctaSecondary: "See a demo invite",
      scroll: "Explore",
    },
    demo: {
      recipientName: "Emily",
      time: "Feb 14, 7:30 PM",
      place: "At the Italian restaurant",
      extraMessage: "Dress warm 💘",
    },
    create: {
      title: "Create your invitation",
      subtitle: "Fill in the details and get a unique link for your crush!",
      stripeNote:
        "You will be redirected to Stripe for secure payment. Your email will not be used for marketing and you will not receive promotional messages.",
    },
    form: {
      privacyLabel: "Your data is protected",
      privacyTooltip:
        "We don't store your data on any server and we have no database. All invitation details are encrypted directly into the link you receive. Nobody — including us — can see or access what you've written. Only the person you send the link to will be able to open it.",
      recipientLabel: "Recipient's name",
      recipientPlaceholder: "E.g. Emily",
      timeLabel: "Date and time",
      timePlaceholder: "E.g. Feb 14 at 7:30 PM",
      placeLabel: "Place",
      placePlaceholder: "E.g. At the Italian restaurant",
      messageLabel: "Extra message",
      messagePlaceholder: "E.g. Dress warm 💘",
      requiredError: "Please enter the recipient's name.",
      genericError: "Something went wrong. Please try again.",
      networkError: "Network error. Please try again.",
      maxChars: "Maximum {n} characters.",
      submitting: "Redirecting to payment...",
      submit: "Create and pay €1.99",
      disclaimer:
        "You will be redirected to Stripe for secure payment. Your email will not be used for marketing and you will not receive promotional messages.",
    },
    invitation: {
      question: "will you go on a date with me?",
      yes: "YES",
      no: "NO",
      hooray: "Yay! 🎉",
      dateTime: "🕐 Date & time:",
      place: "📍 Place:",
      seeYou: "✨ See you there! ✨",
    },
    copy: {
      ariaLabel: "Copy link",
      copied: "Copied!",
      copy: "Copy 📋",
    },
    success: {
      titleBefore: "Your ",
      titleBrand: "datememaybe",
      titleAfter: " invite is ready!",
      linkLabel: "Your unique invitation link:",
      qrLabel: "Or scan this QR code:",
      qrAlt: "QR code for invitation link",
      preview: "Preview your invite 💝",
      tip: "Tip: Send the link via SMS, email, or social media! 💬",
      paymentIncomplete: "Payment not completed",
      paymentIncompleteDesc:
        "It looks like your payment hasn't been confirmed yet. Please try again.",
      backHome: "Back to home",
      error: "Something went wrong",
      errorDesc:
        "We couldn't confirm your payment session. Please contact support if you were charged.",
    },
    cancel: {
      title: "Payment cancelled",
      description:
        "No worries! Your invitation hasn't been created yet. You can try again whenever you're ready.",
      backHome: "Back to home 💕",
    },
    notFound: {
      title: "Invitation not found",
      description: "This invitation doesn't exist or is no longer active.",
      createYours: "Create yours ✉️",
    },
    footer: {
      text: "Made with love — Date Me Maybe",
    },
    og: {
      alt: "datememaybe.net — A date invitation they can't refuse",
      subtitle: "A date invitation they can't refuse 💕",
    },
  },
};

export type Dictionary = (typeof dictionaries)["bg"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
