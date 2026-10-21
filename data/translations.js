/* ============================================================
   ANTI MATTER — data/translations.js
   ============================================================
   ALL website text lives here. Three languages:
     en  = English        ar  = Arabic        ckb = Kurdish (Sorani)

   HOW TO EDIT
   - Find the line you want (the left side is the "key", never change it).
   - Change only the text on the right, inside the quotes.
   - Each key appears once per language. Keep the same keys in all three.

   HOW TO ADD A NEW LANGUAGE
   - Copy a whole block (for example "en: { ... }"), rename it, translate it.
   - Fill in the four "_" lines at the top (label, name, lang, dir).
   - The language button appears in the menu automatically.

   The "_label" is the short code shown on the button (EN / AR / KR).
   "_dir" is "ltr" (left to right) or "rtl" (right to left).
   Tip: "<br>" in cta.orb means "new line".
   Note: the Arabic and Kurdish text is a first draft. Please have a
   native speaker read it before launch.
   ============================================================ */

window.TRANSLATIONS = {

  /* ───────────── ENGLISH ───────────── */
  en: {
    _label: 'EN', _name: 'English', _lang: 'en', _dir: 'ltr',

    'meta.title':       'ANTI MATTER — Software studio',
    'meta.description': 'ANTI MATTER builds software, digital products and experiences, engineered from first principles.',
    'skip':             'Skip to content',
    'cursor.view':      'View',

    'nav.work':     'Work',
    'nav.services': 'Services',
    'nav.about':    'About',
    'nav.contact':  'Contact',

    'hero.lead': 'We build what comes next.',
    'hero.sub':  'Software, products and digital experiences, engineered from first principles.',
    'hero.cta':  'Start a project',

    'work.title': 'Selected work',

    'services.title': 'Services',
    'svc1.title': 'Product development',   'svc1.text': 'From first prototype to a product people pay for.',
    'svc2.title': 'Web applications',      'svc2.text': 'Fast, accessible apps built to scale.',
    'svc3.title': 'Mobile applications',   'svc3.text': 'Native-quality iOS and Android experiences.',
    'svc4.title': 'AI & automation',       'svc4.text': 'Models and workflows that remove manual work.',
    'svc5.title': 'UI/UX engineering',     'svc5.text': 'Interfaces designed and built as one system.',
    'svc6.title': 'Software architecture', 'svc6.text': 'Foundations that stay clean as you grow.',

    'about.title': 'About',
    'about.text':  'ANTI MATTER is a software company for ambitious products. A small team of engineers and designers takes an idea from first sketch to production, then keeps improving it after launch.',

    'process.title': 'Process',
    'step1.title': 'Discover', 'step1.text': 'We learn the problem, the users and the constraints.',
    'step2.title': 'Design',   'step2.text': 'Flows, interfaces and prototypes you can test.',
    'step3.title': 'Engineer', 'step3.text': 'Production code, reviewed and shipped weekly.',
    'step4.title': 'Launch',   'step4.text': 'Deployment, monitoring and a calm release.',
    'step5.title': 'Evolve',   'step5.text': 'Measure, learn and keep improving.',

    'cta.l1': "Let's build",
    'cta.l2': 'something that',
    'cta.l3': "shouldn't exist",
    'cta.l4': 'yet.',
    'cta.orb': 'Start a<br>project',

    'footer.copy': '© 2026 ANTI MATTER. All rights reserved.',

    'projects.ledger.title':       'Ledger',
    'projects.ledger.description': 'Digital banking platform serving 2.1M customers',
    'projects.sable.title':        'Sable',
    'projects.sable.description':  'AI workspace that turns meetings into shipped tasks',
    'projects.halo.title':         'Halo',
    'projects.halo.description':   '3D commerce experience for a furniture brand',
    'projects.meridian.title':       'Meridian',
    'projects.meridian.description': 'Operations system for a global logistics network'
  },

  /* ───────────── ARABIC (العربية) ───────────── */
  ar: {
    _label: 'AR', _name: 'العربية', _lang: 'ar', _dir: 'rtl',

    'meta.title':       'ANTI MATTER — استوديو برمجيات',
    'meta.description': 'ANTI MATTER تبني البرمجيات والمنتجات والتجارب الرقمية، مصمّمة من المبادئ الأولى.',
    'skip':             'انتقل إلى المحتوى',
    'cursor.view':      'عرض',

    'nav.work':     'الأعمال',
    'nav.services': 'الخدمات',
    'nav.about':    'من نحن',
    'nav.contact':  'تواصل معنا',

    'hero.lead': 'نبني ما سيأتي بعد.',
    'hero.sub':  'برمجيات ومنتجات وتجارب رقمية، مصمّمة من المبادئ الأولى.',
    'hero.cta':  'ابدأ مشروعك',

    'work.title': 'أعمال مختارة',

    'services.title': 'الخدمات',
    'svc1.title': 'تطوير المنتجات',            'svc1.text': 'من النموذج الأولي إلى منتج يدفع الناس مقابله.',
    'svc2.title': 'تطبيقات الويب',             'svc2.text': 'تطبيقات سريعة وسهلة الاستخدام مبنية للتوسّع.',
    'svc3.title': 'تطبيقات الجوال',            'svc3.text': 'تجارب iOS وAndroid بجودة أصلية.',
    'svc4.title': 'الذكاء الاصطناعي والأتمتة', 'svc4.text': 'نماذج وسير عمل تُلغي العمل اليدوي.',
    'svc5.title': 'هندسة الواجهات وتجربة المستخدم', 'svc5.text': 'واجهات تُصمَّم وتُبنى كنظام واحد.',
    'svc6.title': 'هندسة البرمجيات',           'svc6.text': 'أسس تبقى نظيفة مع نموّك.',

    'about.title': 'من نحن',
    'about.text':  'ANTI MATTER شركة برمجيات للمنتجات الطموحة. فريق صغير من المهندسين والمصممين ينقل الفكرة من أول رسم إلى الإنتاج، ثم يواصل تحسينها بعد الإطلاق.',

    'process.title': 'آلية العمل',
    'step1.title': 'اكتشاف', 'step1.text': 'نفهم المشكلة والمستخدمين والقيود.',
    'step2.title': 'تصميم',  'step2.text': 'مسارات وواجهات ونماذج أولية يمكنك تجربتها.',
    'step3.title': 'هندسة',  'step3.text': 'برمجة جاهزة للإنتاج، تُراجَع وتُطلق أسبوعيًا.',
    'step4.title': 'إطلاق',  'step4.text': 'نشر ومراقبة وإصدار هادئ.',
    'step5.title': 'تطوير',  'step5.text': 'نقيس ونتعلّم ونواصل التحسين.',

    'cta.l1': 'لنبنِ',
    'cta.l2': 'شيئًا',
    'cta.l3': 'لا ينبغي أن يوجد',
    'cta.l4': 'بعد.',
    'cta.orb': 'ابدأ<br>مشروعك',

    'footer.copy': '© 2026 ANTI MATTER. جميع الحقوق محفوظة.',

    'projects.ledger.title':       'Ledger',
    'projects.ledger.description': 'منصة مصرفية رقمية تخدم 2.1 مليون عميل',
    'projects.sable.title':        'Sable',
    'projects.sable.description':  'مساحة عمل بالذكاء الاصطناعي تحوّل الاجتماعات إلى مهام منجزة',
    'projects.halo.title':         'Halo',
    'projects.halo.description':   'تجربة تجارة ثلاثية الأبعاد لعلامة أثاث',
    'projects.meridian.title':       'Meridian',
    'projects.meridian.description': 'نظام عمليات لشبكة لوجستية عالمية'
  },

  /* ───────────── KURDISH SORANI (کوردی) ───────────── */
  ckb: {
    _label: 'KR', _name: 'کوردی', _lang: 'ckb', _dir: 'rtl',

    'meta.title':       'ANTI MATTER — ستۆدیۆی نەرمەکاڵا',
    'meta.description': 'ANTI MATTER نەرمەکاڵا، بەرهەم و ئەزموونی دیجیتاڵی دروست دەکات، لە بنەماکانەوە دیزاین کراون.',
    'skip':             'بازدان بۆ ناوەڕۆک',
    'cursor.view':      'بینین',

    'nav.work':     'کارەکان',
    'nav.services': 'خزمەتگوزارییەکان',
    'nav.about':    'دەربارە',
    'nav.contact':  'پەیوەندی',

    'hero.lead': 'ئەوە دروست دەکەین کە دواتر دێت.',
    'hero.sub':  'نەرمەکاڵا، بەرهەم و ئەزموونی دیجیتاڵی، لە بنەماکانەوە دیزاین کراون.',
    'hero.cta':  'پڕۆژەیەک دەست پێبکە',

    'work.title': 'کارە هەڵبژێردراوەکان',

    'services.title': 'خزمەتگوزارییەکان',
    'svc1.title': 'گەشەپێدانی بەرهەم',          'svc1.text': 'لە یەکەم نموونەوە بۆ بەرهەمێک کە خەڵک پارەی بۆ دەدەن.',
    'svc2.title': 'ئەپی وێب',                   'svc2.text': 'ئەپی خێرا و بەردەست کە بۆ گەورەبوون دروستکراون.',
    'svc3.title': 'ئەپی مۆبایل',                'svc3.text': 'ئەزموونی iOS و Android بە کوالێتیی ئەسڵی.',
    'svc4.title': 'زیرەکی دەستکرد و ئۆتۆمەیشن', 'svc4.text': 'مۆدێل و ڕێڕەوی کار کە کاری دەستی نامێنێت.',
    'svc5.title': 'ئەندازیاریی UI/UX',          'svc5.text': 'ڕووکار کە وەک یەک سیستەم دیزاین و دروست دەکرێت.',
    'svc6.title': 'ئەندازیاریی نەرمەکاڵا',      'svc6.text': 'بنچینەگەلێک کە لەگەڵ گەورەبوونتان پاک دەمێننەوە.',

    'about.title': 'دەربارە',
    'about.text':  'ANTI MATTER کۆمپانیایەکی نەرمەکاڵایە بۆ بەرهەمە بەرزەفڕەکان. تیمێکی بچووکی ئەندازیار و دیزاینەر بیرۆکەیەک لە یەکەم نەخشەوە دەگەیەنێتە بەرهەمهێنان، پاشان دوای دەستپێکردن بەردەوام باشتری دەکات.',

    'process.title': 'شێوازی کارکردن',
    'step1.title': 'دۆزینەوە',   'step1.text': 'کێشەکە و بەکارهێنەران و سنوورەکان دەناسین.',
    'step2.title': 'دیزاین',     'step2.text': 'ڕێڕەو و ڕووکار و نموونەی تاقیکردنەوە.',
    'step3.title': 'ئەندازیاری', 'step3.text': 'کۆدی بەرهەمهێنان، پێداچوونەوەی بۆ دەکرێت و هەفتانە دەخرێتە کار.',
    'step4.title': 'دەستپێکردن', 'step4.text': 'بڵاوکردنەوە، چاودێری و دەرچوونێکی ئارام.',
    'step5.title': 'پەرەپێدان',  'step5.text': 'دەپێوین، فێر دەبین و بەردەوام باشتری دەکەین.',

    'cta.l1': 'با شتێک',
    'cta.l2': 'دروست بکەین',
    'cta.l3': 'کە هێشتا نابێت',
    'cta.l4': 'هەبێت.',
    'cta.orb': 'پڕۆژەیەک<br>دەست پێبکە',

    'footer.copy': '© 2026 ANTI MATTER. هەموو مافەکان پارێزراون.',

    'projects.ledger.title':       'Ledger',
    'projects.ledger.description': 'پلاتفۆرمی بانکی دیجیتاڵی بۆ 2.1 ملیۆن کڕیار',
    'projects.sable.title':        'Sable',
    'projects.sable.description':  'شوێنی کاری زیرەکی دەستکرد کە کۆبوونەوەکان دەکات بە ئەرکی ئەنجامدراو',
    'projects.halo.title':         'Halo',
    'projects.halo.description':   'ئەزموونی بازرگانیی سێ ڕەهەندی بۆ براندی کەلوپەل',
    'projects.meridian.title':       'Meridian',
    'projects.meridian.description': 'سیستەمی ئۆپەراسیۆن بۆ تۆڕێکی لۆجستیی جیهانی'
  }
};
