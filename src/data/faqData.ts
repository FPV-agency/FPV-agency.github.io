export interface FAQItem {
  id: string;
  questionUa: string;
  questionEn: string;
  answerUa: string;
  answerEn: string;
}

export interface FAQCategory {
  id: string;
  titleUa: string;
  titleEn: string;
  items: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: 'process',
    titleUa: 'Процес розробки',
    titleEn: 'Development Process',
    items: [
      {
        id: 'process-1',
        questionUa: 'Що таке унікальний процес розробки FPV?',
        questionEn: 'What is the unique FPV development process?',
        answerUa: 'Процес розробки FPV (the Future Pages Vibe) — це швидкісний безшовної інтеграції цикл: від вибору готового шаблону до фінальної адаптації контенту під Ваші пріоритети, оминувши застарілу бюрократію. Все створюється на базі перевірених надшвидких компонентів.',
        answerEn: 'The FPV (the Future Pages Vibe) development flow is a rapid, seamless integration cycle: from choosing a ready-made template to final content adaptation tuned to your priorities, bypassing obsolete bureaucracy. Everything is built on proven ultra-fast components.'
      },
      {
        id: 'process-2',
        questionUa: 'Які етапи проходить мій майбутній проект?',
        questionEn: 'What stages will my future project go through?',
        answerUa: `Етапи максимально прозорі:
1) Вибір базового шаблону або преміального концепту.
2) Узгодження Ваших побажань та тексту у формі зворотнього зв'язку.
3) Налаштування інтерактивних елементів, SEO-параметрів та фінальне тестування швидкості.
4) Передача готового результату та запуск на хостингу.`,
        answerEn: `The steps are highly transparent:
1) Selecting a base template or premium design concept.
2) Aligning your text and requirements via the interactive inquiry form.
3) Customizing interactive modules, SEO metadata, and final speed benchmarks.
4) Handover and continuous deployment on secure and lightning-fast hosting.`
      },
      {
        id: 'process-3',
        questionUa: 'Чи можу я комбінувати блоки з різних шаблонів?',
        questionEn: 'Can I mix layout blocks from different themes?',
        answerUa: 'Так, абсолютно! Саме для цього у нас діє формула "Мікс-комбо". Ви можете обрати дизайн кошика з E-commerce, структуру шапки з SaaS-панелі та галерею з Real Estate. Ми зведемо їх у єдиний унікальний інтерфейс.',
        answerEn: 'Yes, absolutely! That is exactly what our "Mix-combo" formula is for. You can combine a secure cart layout from E-commerce, header structure from SaaS dashboard, and gorgeous gallery cards from Real Estate. We integrate them into one cohesive interface.'
      }
    ]
  },
  {
    id: 'terms-prices',
    titleUa: 'Оплата та Терміни',
    titleEn: 'Payment & Timelines',
    items: [
      {
        id: 'terms-1',
        questionUa: 'Скільки часу займає повне створення та запуск?',
        questionEn: 'How long does it take from order to launch?',
        answerUa: `Терміни реактивні:
- Від 2 робочих днів для точних швидких копій (Клонів).
- 3-5 робочих днів для адаптації стандартних шаблонів та інтегрування форм.
- До 7 робочих днів для комплексних "Мікс-комбо" та ексклюзивних концептів.`,
        answerEn: `Timelines are reactive:
- From 2 business days for precise rapid copies (Clones).
- 3-5 business days for standard template customization and inquiry form setup.
- Up to 7 business days for custom full-featured "Mix-combo" and exclusive brand concepts.`
      },
      {
        id: 'terms-2',
        questionUa: 'Як влаштована оплата і чи є приховані комісії?',
        questionEn: 'How is payment structured and are there hidden fees?',
        answerUa: 'Все абсолютно чесно й офіційно: оплата здійснюється виключно в національній валюті за договором публічної оферти. Ціни у нас фіксовані відповідно до вибраного конфігуратора шаблонів, тож жодних додаткових чи непередбачуваних витрат не виникне.',
        answerEn: 'Everything is transparent and official: all billing is handled exclusively in national currency under our public offer agreement. Prices are strictly fixed according to the selected template layout, ensuring zero hidden fees.'
      }
    ]
  },
  {
    id: 'tech',
    titleUa: 'Технології',
    titleEn: 'Technology Stack',
    items: [
      {
        id: 'tech-1',
        questionUa: 'За рахунок чого досягається блискавична швидкість?',
        questionEn: 'How do you achieve lightning-fast performance?',
        answerUa: 'Ми не використовуємо громіздкі "конструктори" та важкі сторонні плагіни. Вся розробка базується на чистому React, Vite, Tailwind CSS та оптимізованій модульній логіці. Це гарантує завантаження сайту менш ніж за 2 секунди за будь-яких умов.',
        answerEn: 'We avoid bloated website builders and heavy monolithic plugins. Everything is engineered using vanilla-fast React, Vite bundlers, Tailwind CSS utility layers, and modular static rendering. This guarantees load times well under 2 seconds worldwide.'
      },
      {
        id: 'tech-2',
        questionUa: 'Чи будуть мої дані надійно захищені?',
        questionEn: 'Will my data and inquiries remain secure?',
        answerUa: "Так. Форми зворотнього зв'язку на сайті проходять ретельне екранування, а статична архітектура Vite зводить практично до нуля ризики зламів, класичних для динамічних платформ на кшталт WordPress. Спаму також не буде — обіцяємо.",
        answerEn: 'Yes. All interactive inputs undergo strict client-side validation and server integration defenses. The clean client-side React architecture combined with stationary assets eliminates 99% of vulnerabilities standard in systems like WordPress.'
      }
    ]
  }
];
