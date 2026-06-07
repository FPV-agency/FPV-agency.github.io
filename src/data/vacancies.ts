export interface Job {
  title: string;
  requirements?: string;
  additional?: string;
}

export interface Department {
  id: string;
  nameUa: string;
  nameEn: string;
  count: number;
  noteUa?: string;
  noteEn?: string;
  jobsUa: Job[];
  jobsEn: Job[];
}

export const vacanciesData: Department[] = [
  {
    id: 'accounting',
    nameUa: 'Бухгалтерія',
    nameEn: 'Accounting',
    count: 1,
    jobsUa: [
      { title: 'Помічник бухгалтера', requirements: 'толковий**' }
    ],
    jobsEn: [
      { title: 'Assistant Accountant', requirements: 'smart**' }
    ]
  },
  {
    id: 'sales',
    nameUa: 'Відділ продажів',
    nameEn: 'Sales Department',
    count: 1,
    jobsUa: [
      { 
        title: 'Менеджер по проектах', 
        requirements: 'досвід у сфері продажів від 5 років*, вільне володіння Українською мовою**, наявність робочого номеру телефону та вільного акаунту у телеграм.' 
      }
    ],
    jobsEn: [
      { 
        title: 'Project Manager', 
        requirements: 'experience in sales from 5 years*, fluent Ukrainian language**, valid phone number and active Telegram account.' 
      }
    ]
  },
  {
    id: 'legal',
    nameUa: 'Юридичний відділ',
    nameEn: 'Legal Department',
    count: 1,
    jobsUa: [
      { title: 'Помічник юриста', requirements: 'толковий**' }
    ],
    jobsEn: [
      { title: 'Paralegal / Assistant Lawyer', requirements: 'smart**' }
    ]
  },
  {
    id: 'technical',
    nameUa: 'Технічний відділ',
    nameEn: 'Technical Department',
    count: 2,
    jobsUa: [
      { title: 'Копірайтер' },
      { title: 'Веб-розробник' }
    ],
    jobsEn: [
      { title: 'Copywriter' },
      { title: 'Web Developer' }
    ]
  },
  {
    id: 'creative',
    nameUa: 'Креативний відділ',
    nameEn: 'Creative Department',
    count: 9,
    noteUa: '(Усі вакансії реальні, відбір дуже ретельний, тестові завдання оплачувані, є етап стажування)',
    noteEn: '(All vacancies are real, selection is very thorough, test tasks are paid, there is an internship stage)',
    jobsUa: [
      { title: 'Меценат', requirements: 'Просто гарна людина*' },
      { title: 'Спонсор', requirements: 'Гарна людина*, але з інформаційною користю.' },
      { title: 'Інвестор проекту', requirements: 'Інвестує ідеї та отримує дівіденди.' },
      { title: 'Перекладач з "Клієнтського" на "Технічний" і навпаки', requirements: 'Неспішно підшукуємо' },
      { title: 'Гадалка на ментальних картах', requirements: 'Циганка у 5му поколінні**, національний костюм**, ROAS, ROMI, SWOT, BPMN, CJM, CAC, LTV...' },
      { title: 'Філософ-спічмейкер', requirements: 'гуманітарій, книголюб, напрямок філософія, вміння лаконічно викладати складні смислові конструкції**. Оплата: 1,00-50,00 грн./символ' },
      { title: 'Маскот-талісман компанії', requirements: 'охайна, позитивна і добра людина**, приносить вдачу для компанії**, приваблює клієнтів**.' },
      { title: 'Памфлетмейкер', requirements: 'вміння писати рифмовані тексти для висміювання та критики актуальних подій чи персон.' },
      { title: 'Ботофермер' }
    ],
    jobsEn: [
      { title: 'Benefactor', requirements: 'Just a nice person*' },
      { title: 'Sponsor', requirements: 'A nice person*, but with informational benefit.' },
      { title: 'Project Investor', requirements: 'Invests ideas and receives dividends.' },
      { title: 'Translator from "Clientish" to "Technical" and vice versa', requirements: 'Unhurriedly looking for' },
      { title: 'Fortune teller on mental maps', requirements: '5th generation Romani**, national costume**, ROAS, ROMI, SWOT, BPMN, CJM, CAC, LTV...' },
      { title: 'Philosopher-Speechmaker', requirements: 'humanitarian, book lover, major in philosophy, ability to concisely express complex semantic structures**. Pay: 1.00-50.00 UAH/symbol' },
      { title: 'Mascot-Talisman of the company', requirements: 'neat, positive and kind person**, brings luck to the company**, attracts clients**.' },
      { title: 'Pamphleteer', requirements: 'ability to write rhymed texts for mocking and criticizing current events or personas.' },
      { title: 'Bot Farmer' }
    ]
  }
];

export const vacanciesTextUa = `Бухгалтерія:

* - бажано, але не обовʼязково.
** - обовʼязково.
! - ознайомитись** з п.5 КК.

1. Помічник бухгалтера. Вимоги: толковий**.


Відділ продажів:

* - бажано, але не обовʼязково.
** - обовʼязково.
! - ознайомитись** з п.5 КК.

1. Менеджер по проектах. Вимоги: досвід у сфері продажів від 5 років*, вільне володіння Українською мовою**, наявність робочого номеру телефону та вільного акаунту у телеграм.


Юридичний відділ:

* - бажано, але не обовʼязково.
** - обовʼязково.
! - ознайомитись** з п.5 КК.

1. Помічник юриста. Вимоги: толковий**.


Технічний відділ:

* - бажано, але не обовʼязково.
** - обовʼязково.
! - ознайомитись** з п.5 КК.

1. Копірайтер
2. Веб-розробник


Креативний відділ:

(Усі вакансії реальні, відбір дуже ретельний, тестові завдання оплачувані, є етап стажування).

* - бажано, але не обовʼязково.
** - обовʼязково.
! - ознайомитись** з п.5 КК.

Постійні вакансії!!!

1. Меценат. Вимоги: Просто гарна людина*
2. Спонсор. Вимоги: Гарна людина*, але з інформаційною користю.
3. Інвестор проекту. Інвестує ідеї та отримує дівіденди.

Неспішно підшукуємо:

4. Перекладач з "Клієнтського" на "Технічний" і навпаки.
5. Гадалка на ментальних картах. Вимоги: Циганка у 5му поколінні**, національний костюм**, ROAS, ROMI, SWOT, BPMN, CJM, CAC, LTV...
6. Філософ-спічмейкер. Вимоги: гуманітарій, книголюб, напрямок філософія, вміння лаконічно викладати складні смислові конструкції**. Оплата: 1,00-50,00 грн./символ
7. Маскот-талісман компанії. Вимоги: охайна, позитивна і добра людина**, приносить вдачу для компанії**, приваблює клієнтів**.
8. Памфлетмейкер. Вимоги: вміння писати рифмовані тексти для висміювання та критики актуальних подій чи персон.
9. Ботофермер`;

export const vacanciesTextEn = `Accounting:

* - preferred, but not required.
** - mandatory.
! - familiarize** with Art. 5 of the Criminal Code.

1. Assistant Accountant. Requirements: smart**.


Sales Department:

* - preferred, but not required.
** - mandatory.
! - familiarize** with Art. 5 of the Criminal Code.

1. Project Manager. Requirements: experience in sales from 5 years*, fluent Ukrainian language**, valid phone number and active Telegram account.


Legal Department:

* - preferred, but not required.
** - mandatory.
! - familiarize** with Art. 5 of the Criminal Code.

1. Paralegal / Assistant Lawyer. Requirements: smart**.


Technical Department:

* - preferred, but not required.
** - mandatory.
! - familiarize** with Art. 5 of the Criminal Code.

1. Copywriter
2. Web Developer


Creative Department:

(All vacancies are real, the selection is very thorough, test tasks are paid, there is an internship stage).

* - preferred, but not required.
** - mandatory.
! - familiarize** with Art. 5 of the Criminal Code.

Permanent vacancies!!!

1. Benefactor. Requirements: Just a nice person*
2. Sponsor. Requirements: A nice person*, but with informational benefit.
3. Project Investor. Invests ideas and receives dividends.

Unhurriedly looking for:

4. Translator from "Clientish" to "Technical" and vice versa.
5. Fortune teller on mental maps. Requirements: 5th generation Romani**, national costume**, ROAS, ROMI, SWOT, BPMN, CJM, CAC, LTV...
6. Philosopher-Speechmaker. Requirements: humanitarian, book lover, major in philosophy, ability to concisely express complex semantic structures**. Pay: 1.00-50.00 UAH/symbol
7. Mascot-Talisman of the company. Requirements: neat, positive and kind person**, brings luck to the company**, attracts clients**.
8. Pamphleteer. Requirements: ability to write rhymed texts for mocking and criticizing current events or personas.
9. Bot Farmer`;
